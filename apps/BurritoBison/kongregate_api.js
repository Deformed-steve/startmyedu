function KongregateAPI() {
  this._initialize()
}

(function() {
  window.KonduitEvent = {
    INIT: "init",
    CONNECT: "connect",
    CONNECTED: "connected",
    DISCONNECT: "disconnect",
    LOGIN: "login",
    OP_CONNECTED: "connected",
    OP_HELLO: "hello",
    OP_USER_INFO: "user.info",
    OP_STATS_SUBMIT: "stat.submit",
    ITEM_LIST: "mtx.item_list",
    ITEM_CHECKOUT: "mtx.checkout",
    ITEM_INSTANCES: "mtx.item_instances",
    USE_ITEM_INSTANCE: "mtx.use_item_instance",
    PURCHASE_RESULT: "purchase_result",
    ADS_INITIALIZE: "ads.initialize",
    ADS_SHOW_INCENTIVIZED: "ads.show_incentivized",
  };

  const Log = {
    debugLevel: 0,
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {},
    always: function() {}
  };

  const Utils = {
    isKlient: () => false,
    merge: (a, b) => {
      if (!a || !b) return a || b;
      for (const k in b)
        if (Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k];
      return a;
    },
    toW3CDTF: (d) => d instanceof Date ? d.toISOString().replace('Z', '-00:00') : "",
    md5: () => "fghfhgpomjfghjkopmjhgf", // dummy
  };

  // No-op base service helper
  function makeNoopService(name, extra = {}) {
    const s = {
      _name: name,
      addEventListener: function() {},
      removeEventListener: function() {},
      _enqueueRequest: function(_p, _cb) {},
      _completeRequest: function(_e, _t) {},
      sendMessage: function() {},
    };
    return Object.assign(s, extra);
  }

  function ApiServices(opts) {
    this._kongVars = opts?.kongregate_variables || {};
    this._username = this._kongVars.kongregate_username || "Guest";
    this._authToken = this._kongVars.kongregate_game_auth_token || "";
    this._userId = parseInt(this._kongVars.kongregate_user_id, 10) || 0;
    this._gameId = parseInt(this._kongVars.kongregate_game_id, 10) || 0;
  }
  ApiServices.prototype = makeNoopService("services", {
    isKongregate: function() {
      return !!(this._kongVars.kongregate);
    },
    isExternal: function() {
      return !this.isKongregate();
    },
    getUsername: function() {
      return this._username;
    },
    getUserId: function() {
      return this._userId;
    },
    getUserID: function() {
      return this.getUserId();
    },
    getGameId: function() {
      return this._gameId;
    },
    getGameID: function() {
      return this.getGameId();
    },
    getGameAuthToken: function() {
      return this._authToken;
    },
    isGuest: function() {
      return this._userId === 0;
    },
    isConnected: function() {
      return false;
    },
    connect: function() {},
    connectExternal: function() {},
  });

  function StatisticServices(ctx) {
    this._services = ctx.services;
  }
  StatisticServices.prototype = {
    submit: function( /*name, value*/ ) {},
    submitArray: function( /*[{name,value}]*/ ) {}
  };

  function MicrotransactionServices(ctx) {
    this._services = ctx.services;
    this._adCallbacks = {};
  }
  MicrotransactionServices.prototype = {
    requestItemList: function(_tags, cb) {
      cb && cb({
        success: true,
        data: []
      });
    },
    requestUserItemList: function(_user, cb) {
      cb && cb({
        success: true,
        data: []
      });
    },
    purchaseItems: function(_ids, cb) {
      cb && cb({
        success: false
      });
    },
    purchaseItemsRemote: function(_info, cb) {
      cb && cb({
        success: false
      });
    },
    useItemInstance: function(_id, cb) {
      cb && cb({
        success: false
      });
    },
    showKredPurchaseDialog: function() {},
    initializeIncentivizedAds: function() {},
    showIncentivizedAd: function() {},
    addEventListener: function(event, fn) {
      (this._adCallbacks[event] = this._adCallbacks[event] || []).push(fn);
    }
  };

  function ChatServices(ctx) {
    this._services = ctx.services;
    this._listeners = {};
  }
  ChatServices.prototype = {
    showTab: function() {},
    closeTab: function() {},
    displayMessage: function() {},
    clearMessages: function() {},
    displayCanvasImage: function() {},
    displayCanvasText: function() {},
    drawCanvasObject: function() {},
    removeCanvasObject: function() {},
    addEventListener: function(evt, cb) {
      (this._listeners[evt] = this._listeners[evt] || []).push(cb);
    }
  };

  function ImageServices(ctx) {
    this._services = ctx.services;
  }
  ImageServices.prototype = {
    submitAvatar: function(_img, cb) {
      cb && cb(false);
    }
  };

  function SharedContentServices(ctx) {
    this._services = ctx.services;
    this._loads = {};
  }
  SharedContentServices.CONTENT_TYPE_LIMIT = 12;
  SharedContentServices.prototype = {
    browse: function() {},
    save: function(_type, _data, _cb, _image, cb) {
      cb && cb({
        success: false
      });
    },
    addLoadListener: function(type, fn) {
      (this._loads[type] = this._loads[type] || []).push(fn);
    }
  };

  function AnalyticsServices(ctx) {
    this._services = ctx.services;
    this._enabled = false; // hard-off
  }
  AnalyticsServices.prototype = {
    addEvent: function() {},
    addFilterType: function() {},
    setCommonPropsCallback: function() {},
    setCommonProperties: function() {},
    updateCommonProperties: function() {},
    getAutoLongProperty: function() {
      return 0;
    },
    getAutoLongLongProperty: function() {
      return 0;
    },
    getAutoStringProperty: function() {
      return "";
    },
    getAutoBoolProperty: function() {
      return false;
    },
    getAutoDoubleProperty: function() {
      return 0;
    },
    getAutoIntProperty: function() {
      return 0;
    },
    getAutoUTCProperty: function() {
      return "";
    },
    getAutoPropertiesJSON: function() {
      return "{}";
    },
    startPurchase: function() {},
    finishPurchase: function() {},
    setAutomaticVariablesListener: function() {},
    start: function() {}
  };

  function buildAPI(kvars) {
    const services = new ApiServices({
      kongregate_variables: kvars
    });
    return {
      services,
      stats: new StatisticServices({
        services
      }),
      mtx: new MicrotransactionServices({
        services
      }),
      chat: new ChatServices({
        services
      }),
      images: new ImageServices({
        services
      }),
      sharedContent: new SharedContentServices({
        services
      }),
      analytics: new AnalyticsServices({
        services
      }),
    };
  }

  window.Kongregate = {
    Log,
    Utils
  };

  window.kongregateUnitySupport = window.kongregateUnitySupport || {
    onUnityEmbed: function() {},
    initAPI: function(objectName, callbackName) {
      try {
        const target = window[objectName];
        if (target && typeof target[callbackName] === "function") {
          target[callbackName]();
        }
      } catch (_) {}
    },
    getUnityObject: function() {
      return null;
    },
    getUserInfoString: function() {
      return ["0", "Guest", ""].join("|");
    },
    hijackUnityErrorHandler: function() {},
  };

  function KongregateAPI() {
    this._flashVarsObject = {};
    this._servicesBundle = null;
    this.unityElementId = null;
  }
  KongregateAPI.prototype = {
    _initialize: function() {},
    flashVarsString: function() {
      return "";
    },
    flashVarsObject: function() {
      return this._flashVarsObject;
    },
    getVariable: function(k) {
      return this._flashVarsObject[k];
    },
    loadAPI: function(cb) {
      if (!this._servicesBundle) {
        this._servicesBundle = buildAPI(this._flashVarsObject);
        window.kongregate = this._servicesBundle;
      }
      if (typeof cb === "function") Promise.resolve().then(cb);
    },
    getAPI: function() {
      return this._servicesBundle || buildAPI(this._flashVarsObject);
    },
    embedFrame: function() {}, // no-op
    _setGameSwf: function() {},
    _findSwf: function() {
      return null;
    },
    _createJavascriptApi: function() {},
    _createMessageConnection: function() {
      return null;
    }
  };
  window.KongregateAPI = KongregateAPI;
  window.kongregateAPI = new KongregateAPI();
})();