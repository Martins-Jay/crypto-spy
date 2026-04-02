export default class MarketModel {
  #socket = null;
  #priceUpdateSubscribers = [];
  #topCoins = [];
  #exchangeInfoCache = null;
  #reconnectTimer = null;
  #maxRetries = 5;
  #baseUrl = 'https://api.coingecko.com/api/v3';
  #currency = 'usd';

  constructor() {
    this.exchangeList = [];
  }

  /* ============================================================
     SAFE FETCH WITH RETRIES
  ============================================================ */
  async #safeFetch(url, errorMsg) {
    for (let attempt = 1; attempt <= this.#maxRetries; attempt++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${errorMsg} (status ${res.status})`);
        return await res.json();
      } catch (err) {
        if (attempt === this.#maxRetries) throw err;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  /* ============================================================
     FETCH MULTIPLE PAGES
  ============================================================ */
  async #fetchAllPages(pages = 4, perPage = 250) {
    const requests = [];
    for (let i = 1; i <= pages; i++) {
      const url = `${this.#baseUrl}/coins/markets?vs_currency=${
        this.#currency
      }&order=market_cap_desc&per_page=${perPage}&page=${i}`;
      requests.push(this.#safeFetch(url, `Failed to fetch page ${i}`));
    }
    const results = await Promise.all(requests);
    return results.flat();
  }

  /* ============================================================
     FETCH BINANCE SYMBOLS (Cache)
  ============================================================ */
  async #getBinanceSymbols() {
    if (this.#exchangeInfoCache) return this.#exchangeInfoCache;

    try {
      const res = await fetch('https://api.binance.com/api/v3/exchangeInfo');
      if (!res.ok) throw new Error('Failed to fetch Binance exchangeInfo');
      const data = await res.json();
      const symbols = new Set(data.symbols.map((s) => s.symbol.toUpperCase()));
      this.#exchangeInfoCache = symbols;
      return symbols;
    } catch (err) {
      this.#exchangeInfoCache = new Set();
      return this.#exchangeInfoCache;
    }
  }

  /* ============================================================
     FILTER OUT NON-BINANCE COINS
  ============================================================ */
  async #filterBinanceCoins(coins) {
    const binanceSymbols = await this.#getBinanceSymbols();
    return coins.filter((coinObj) =>
      binanceSymbols.has(`${coinObj.symbol.toUpperCase()}USDT`)
    );
  }

  /* ============================================================
     FETCH TOP COINS BY MARKET CAP
  ============================================================ */
  async fetchTopCoins(limit = 10) {
    const data = await this.#safeFetch(
      `${this.#baseUrl}/coins/markets?vs_currency=${
        this.#currency
      }&order=market_cap_desc&per_page=${limit}&page=1`,
      'Failed to fetch top coins'
    );

    const formatted = data.map(this.#formatCoinData);
    const filtered = await this.#filterBinanceCoins(formatted);
    this.#topCoins = filtered.slice(0, limit);
    return this.#topCoins;
  }

  /* ============================================================
     FETCH GAINERS
  ============================================================ */
  async fetchGainers(limit = 10) {
    const allCoins = await this.#fetchAllPages(4, 250);
    const filtered = allCoins
      .filter((coinObj) => this.#isValidCoin(coinObj))
      .map(this.#formatCoinData);

    const binanceCoins = await this.#filterBinanceCoins(filtered);

    const sorted = binanceCoins.sort((a, b) => {
      const changeA = a.price_change_percentage_24h || 0;
      const changeB = b.price_change_percentage_24h || 0;
      return changeB - changeA;
    });

    this.#topCoins = sorted.slice(0, limit);
    return this.#topCoins;
  }

  /* ============================================================
     FETCH LOSERS
  ============================================================ */
  async fetchLosers(limit = 10) {
    const allCoins = await this.#fetchAllPages(4, 250);
    const filtered = allCoins
      .filter((coinObj) => this.#isValidCoin(coinObj))
      .map(this.#formatCoinData);

    const binanceCoins = await this.#filterBinanceCoins(filtered);

    const sorted = binanceCoins.sort((a, b) => {
      const changeA = a.price_change_percentage_24h || 0;
      const changeB = b.price_change_percentage_24h || 0;
      return changeA - changeB;
    });

    this.#topCoins = sorted.slice(0, limit);
    return this.#topCoins;
  }

  /* ============================================================
     FETCH TRENDING
  ============================================================ */
  async fetchTrending(limit = 5) {
    const data = await this.#fetchAllPages(3, 250);
    const filtered = data
      .filter(
        (coinObj) =>
          this.#isValidCoin(coinObj) &&
          coinObj.market_cap > 5_000_000 &&
          coinObj.total_volume > 1_000_000
      )
      .map(this.#formatCoinData);

    const binanceCoins = await this.#filterBinanceCoins(filtered);

    const sorted = binanceCoins
      .sort(
        (a, b) => b.total_volume / b.market_cap - a.total_volume / a.market_cap
      )
      .slice(0, limit);

    this.#topCoins = sorted;
    return this.#topCoins;
  }

  /* ============================================================
     VALID COIN CHECK
  ============================================================ */
  #isValidCoin(coinObj) {
    const pct = parseFloat(coinObj.price_change_percentage_24h);
    if (
      !coinObj ||
      !coinObj.symbol ||
      isNaN(pct) ||
      coinObj.current_price <= 0 ||
      coinObj.market_cap < 500_000 ||
      /usd|usdt|usdc|dai|busd|tusd|fdusd/i.test(coinObj.symbol)
    ) {
      return false;
    }
    return true;
  }

  /* ============================================================
     LIVE UPDATES (BINANCE)
  ============================================================ */
  async startLiveUpdates(coinList = this.#topCoins) {
    if (this.#socket) this.#socket.close();
    if (this.#reconnectTimer) clearTimeout(this.#reconnectTimer);

    if (!Array.isArray(coinList) || coinList.length === 0) {
      return;
    }

    const binanceSymbols = await this.#getBinanceSymbols();
    const validPairs = coinList
      .map((coinObj) => `${coinObj.symbol.toUpperCase()}USDT`)
      .filter((pair) => binanceSymbols.has(pair))
      .map((pair) => pair.toLowerCase());

    if (!validPairs.length) {
      return;
    }

    const url = `wss://stream.binance.com:9443/stream?streams=${validPairs
      .map((p) => `${p}@ticker`)
      .join('/')}`;

    this.#socket = new WebSocket(url);
    this.#socket.onmessage = (e) => this.#handleMessage(e);

    this.#socket.onclose = () => {
      this.#reconnectTimer = setTimeout(
        () => this.startLiveUpdates(coinList),
        6000
      );
    };
  }

  /* ============================================================
     HANDLE LIVE MESSAGE
  ============================================================ */
  #handleMessage(event) {
    try {
      const parsed = JSON.parse(event.data);
      const data = parsed?.data;
      if (!data) return;

      const symbolRaw = data.s || '';
      const price = parseFloat(data.c);
      const open = parseFloat(data.o);
      if (isNaN(price) || isNaN(open)) return;

      const symbol = symbolRaw.replace('USDT', '').toUpperCase();
      const changePercent = ((price - open) / open) * 100;

      const coinObj = this.#topCoins.find((c) => c.symbol === symbol);
      if (coinObj) {
        coinObj.current_price = price;
        coinObj.price_change_percentage_24h = changePercent;
      }

      this.#notifySubscribers({ symbol, price, change: changePercent });
    } catch (err) {}
  }

  /* ============================================================
     SUBSCRIPTION HANDLERS
  ============================================================ */
  subscribe(updateCoinPriceFn) {
    if (typeof updateCoinPriceFn === 'function')
      this.#priceUpdateSubscribers.push(updateCoinPriceFn);

    return () => {
      this.#priceUpdateSubscribers = this.#priceUpdateSubscribers.filter(
        (storedFn) => storedFn !== updateCoinPriceFn
      );
    };
  }

  #notifySubscribers(coinUpdate) {
    this.#priceUpdateSubscribers.forEach((fn) => fn(coinUpdate));
  }

  /* ============================================================
     FORMAT COIN DATA
  ============================================================ */
  #formatCoinData(coinObj) {
    return {
      id: coinObj.id,
      symbol: coinObj.symbol.toUpperCase(),
      name: coinObj.name,
      image:
        coinObj.image ||
        'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: parseFloat(coinObj.current_price) || 0,
      price_change_percentage_24h:
        parseFloat(coinObj.price_change_percentage_24h) || 0,
      total_volume: coinObj.total_volume || 0,
      market_cap: coinObj.market_cap || 0,
    };
  }

  /* ============================================================
     FOR COIN SYMBOL INPUT AUTO SUGGESTION
  ============================================================ */
  async loadBinanceCoins() {
    try {
      const res = await fetch('https://api.binance.com/api/v3/exchangeInfo');
      const dataObj = await res.json();

      // We dont want duplicates in our array so we use Set. it accepts an iterable eg array and returns a new array
      const coins = [
        ...new Set(dataObj.symbols.map((symbol) => symbol.baseAsset)),
      ];

      return coins;
    } catch (err) {
      console.error('BINANCE LIST ERROR:', err);
      return [];
    }
  }

  /* ============================================================
     FOR INPUT EXCHANGE NAMES SUGGESTION
  ============================================================ */
  async loadExchanges() {
    try {
      const res = await fetch(`${this.#baseUrl}/exchanges/list`)

      if (!res.ok) throw new Error('Failed to fetch exchange list');

      this.exchangeList = await res.json();
      return this.exchangeList;
    } catch (err) {
      throw err;
    }
  }
}
