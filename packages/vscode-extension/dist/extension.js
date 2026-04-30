"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/kind-of@6.0.3/node_modules/kind-of/index.js
var require_kind_of = __commonJS({
  "../../node_modules/.pnpm/kind-of@6.0.3/node_modules/kind-of/index.js"(exports2, module2) {
    var toString = Object.prototype.toString;
    module2.exports = function kindOf(val) {
      if (val === void 0) return "undefined";
      if (val === null) return "null";
      var type = typeof val;
      if (type === "boolean") return "boolean";
      if (type === "string") return "string";
      if (type === "number") return "number";
      if (type === "symbol") return "symbol";
      if (type === "function") {
        return isGeneratorFn(val) ? "generatorfunction" : "function";
      }
      if (isArray(val)) return "array";
      if (isBuffer(val)) return "buffer";
      if (isArguments(val)) return "arguments";
      if (isDate(val)) return "date";
      if (isError(val)) return "error";
      if (isRegexp(val)) return "regexp";
      switch (ctorName(val)) {
        case "Symbol":
          return "symbol";
        case "Promise":
          return "promise";
        case "WeakMap":
          return "weakmap";
        case "WeakSet":
          return "weakset";
        case "Map":
          return "map";
        case "Set":
          return "set";
        case "Int8Array":
          return "int8array";
        case "Uint8Array":
          return "uint8array";
        case "Uint8ClampedArray":
          return "uint8clampedarray";
        case "Int16Array":
          return "int16array";
        case "Uint16Array":
          return "uint16array";
        case "Int32Array":
          return "int32array";
        case "Uint32Array":
          return "uint32array";
        case "Float32Array":
          return "float32array";
        case "Float64Array":
          return "float64array";
      }
      if (isGeneratorObj(val)) {
        return "generator";
      }
      type = toString.call(val);
      switch (type) {
        case "[object Object]":
          return "object";
        case "[object Map Iterator]":
          return "mapiterator";
        case "[object Set Iterator]":
          return "setiterator";
        case "[object String Iterator]":
          return "stringiterator";
        case "[object Array Iterator]":
          return "arrayiterator";
      }
      return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
    };
    function ctorName(val) {
      return typeof val.constructor === "function" ? val.constructor.name : null;
    }
    function isArray(val) {
      if (Array.isArray) return Array.isArray(val);
      return val instanceof Array;
    }
    function isError(val) {
      return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
    }
    function isDate(val) {
      if (val instanceof Date) return true;
      return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
    }
    function isRegexp(val) {
      if (val instanceof RegExp) return true;
      return typeof val.flags === "string" && typeof val.ignoreCase === "boolean" && typeof val.multiline === "boolean" && typeof val.global === "boolean";
    }
    function isGeneratorFn(name, val) {
      return ctorName(name) === "GeneratorFunction";
    }
    function isGeneratorObj(val) {
      return typeof val.throw === "function" && typeof val.return === "function" && typeof val.next === "function";
    }
    function isArguments(val) {
      try {
        if (typeof val.length === "number" && typeof val.callee === "function") {
          return true;
        }
      } catch (err) {
        if (err.message.indexOf("callee") !== -1) {
          return true;
        }
      }
      return false;
    }
    function isBuffer(val) {
      if (val.constructor && typeof val.constructor.isBuffer === "function") {
        return val.constructor.isBuffer(val);
      }
      return false;
    }
  }
});

// ../../node_modules/.pnpm/shallow-clone@3.0.1/node_modules/shallow-clone/index.js
var require_shallow_clone = __commonJS({
  "../../node_modules/.pnpm/shallow-clone@3.0.1/node_modules/shallow-clone/index.js"(exports2, module2) {
    "use strict";
    var valueOf = Symbol.prototype.valueOf;
    var typeOf = require_kind_of();
    function clone(val, deep) {
      switch (typeOf(val)) {
        case "array":
          return val.slice();
        case "object":
          return Object.assign({}, val);
        case "date":
          return new val.constructor(Number(val));
        case "map":
          return new Map(val);
        case "set":
          return new Set(val);
        case "buffer":
          return cloneBuffer(val);
        case "symbol":
          return cloneSymbol(val);
        case "arraybuffer":
          return cloneArrayBuffer(val);
        case "float32array":
        case "float64array":
        case "int16array":
        case "int32array":
        case "int8array":
        case "uint16array":
        case "uint32array":
        case "uint8clampedarray":
        case "uint8array":
          return cloneTypedArray(val);
        case "regexp":
          return cloneRegExp(val);
        case "error":
          return Object.create(val);
        default: {
          return val;
        }
      }
    }
    function cloneRegExp(val) {
      const flags = val.flags !== void 0 ? val.flags : /\w+$/.exec(val) || void 0;
      const re = new val.constructor(val.source, flags);
      re.lastIndex = val.lastIndex;
      return re;
    }
    function cloneArrayBuffer(val) {
      const res = new val.constructor(val.byteLength);
      new Uint8Array(res).set(new Uint8Array(val));
      return res;
    }
    function cloneTypedArray(val, deep) {
      return new val.constructor(val.buffer, val.byteOffset, val.length);
    }
    function cloneBuffer(val) {
      const len = val.length;
      const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
      val.copy(buf);
      return buf;
    }
    function cloneSymbol(val) {
      return valueOf ? Object(valueOf.call(val)) : {};
    }
    module2.exports = clone;
  }
});

// ../../node_modules/.pnpm/isobject@3.0.1/node_modules/isobject/index.js
var require_isobject = __commonJS({
  "../../node_modules/.pnpm/isobject@3.0.1/node_modules/isobject/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function isObject(val) {
      return val != null && typeof val === "object" && Array.isArray(val) === false;
    };
  }
});

// ../../node_modules/.pnpm/is-plain-object@2.0.4/node_modules/is-plain-object/index.js
var require_is_plain_object = __commonJS({
  "../../node_modules/.pnpm/is-plain-object@2.0.4/node_modules/is-plain-object/index.js"(exports2, module2) {
    "use strict";
    var isObject = require_isobject();
    function isObjectObject(o) {
      return isObject(o) === true && Object.prototype.toString.call(o) === "[object Object]";
    }
    module2.exports = function isPlainObject(o) {
      var ctor, prot;
      if (isObjectObject(o) === false) return false;
      ctor = o.constructor;
      if (typeof ctor !== "function") return false;
      prot = ctor.prototype;
      if (isObjectObject(prot) === false) return false;
      if (prot.hasOwnProperty("isPrototypeOf") === false) {
        return false;
      }
      return true;
    };
  }
});

// ../../node_modules/.pnpm/clone-deep@4.0.1/node_modules/clone-deep/index.js
var require_clone_deep = __commonJS({
  "../../node_modules/.pnpm/clone-deep@4.0.1/node_modules/clone-deep/index.js"(exports2, module2) {
    "use strict";
    var clone = require_shallow_clone();
    var typeOf = require_kind_of();
    var isPlainObject = require_is_plain_object();
    function cloneDeep(val, instanceClone) {
      switch (typeOf(val)) {
        case "object":
          return cloneObjectDeep(val, instanceClone);
        case "array":
          return cloneArrayDeep(val, instanceClone);
        default: {
          return clone(val);
        }
      }
    }
    function cloneObjectDeep(val, instanceClone) {
      if (typeof instanceClone === "function") {
        return instanceClone(val);
      }
      if (instanceClone || isPlainObject(val)) {
        const res = new val.constructor();
        for (let key in val) {
          res[key] = cloneDeep(val[key], instanceClone);
        }
        return res;
      }
      return val;
    }
    function cloneArrayDeep(val, instanceClone) {
      const res = new val.constructor(val.length);
      for (let i = 0; i < val.length; i++) {
        res[i] = cloneDeep(val[i], instanceClone);
      }
      return res;
    }
    module2.exports = cloneDeep;
  }
});

// ../../node_modules/.pnpm/consumable-stream@3.0.0/node_modules/consumable-stream/index.js
var require_consumable_stream = __commonJS({
  "../../node_modules/.pnpm/consumable-stream@3.0.0/node_modules/consumable-stream/index.js"(exports2, module2) {
    var ConsumableStream = class {
      async next(timeout) {
        let asyncIterator = this.createConsumer(timeout);
        let result = await asyncIterator.next();
        asyncIterator.return();
        return result;
      }
      async once(timeout) {
        let result = await this.next(timeout);
        if (result.done) {
          if (timeout == null) {
            await new Promise(() => {
            });
          } else {
            let error = new Error(
              "Stream consumer operation timed out early because stream ended"
            );
            error.name = "TimeoutError";
            throw error;
          }
        }
        return result.value;
      }
      createConsumer() {
        throw new TypeError("Method must be overriden by subclass");
      }
      [Symbol.asyncIterator]() {
        return this.createConsumer();
      }
    };
    module2.exports = ConsumableStream;
  }
});

// ../../node_modules/.pnpm/writable-consumable-stream@4.2.0/node_modules/writable-consumable-stream/consumer.js
var require_consumer = __commonJS({
  "../../node_modules/.pnpm/writable-consumable-stream@4.2.0/node_modules/writable-consumable-stream/consumer.js"(exports2, module2) {
    var Consumer = class {
      constructor(stream, id, startNode, timeout) {
        this.id = id;
        this._backpressure = 0;
        this.currentNode = startNode;
        this.timeout = timeout;
        this.isAlive = true;
        this.stream = stream;
        this.stream.setConsumer(this.id, this);
      }
      getStats() {
        let stats = {
          id: this.id,
          backpressure: this._backpressure
        };
        if (this.timeout != null) {
          stats.timeout = this.timeout;
        }
        return stats;
      }
      _resetBackpressure() {
        this._backpressure = 0;
      }
      applyBackpressure(packet) {
        this._backpressure++;
      }
      releaseBackpressure(packet) {
        this._backpressure--;
      }
      getBackpressure() {
        return this._backpressure;
      }
      clearActiveTimeout() {
        clearTimeout(this._timeoutId);
        delete this._timeoutId;
      }
      write(packet) {
        if (this._timeoutId !== void 0) {
          this.clearActiveTimeout(packet);
        }
        this.applyBackpressure(packet);
        if (this._resolve) {
          this._resolve();
          delete this._resolve;
        }
      }
      kill(value) {
        this._killPacket = { value, done: true };
        if (this._timeoutId !== void 0) {
          this.clearActiveTimeout(this._killPacket);
        }
        this._destroy();
        if (this._resolve) {
          this._resolve();
          delete this._resolve;
        }
      }
      _destroy() {
        this.isAlive = false;
        this._resetBackpressure();
        this.stream.removeConsumer(this.id);
      }
      async _waitForNextItem(timeout) {
        return new Promise((resolve, reject) => {
          this._resolve = resolve;
          let timeoutId;
          if (timeout !== void 0) {
            let error = new Error("Stream consumer iteration timed out");
            (async () => {
              let delay = wait(timeout);
              timeoutId = delay.timeoutId;
              await delay.promise;
              error.name = "TimeoutError";
              delete this._resolve;
              reject(error);
            })();
          }
          this._timeoutId = timeoutId;
        });
      }
      async next() {
        this.stream.setConsumer(this.id, this);
        while (true) {
          if (!this.currentNode.next) {
            try {
              await this._waitForNextItem(this.timeout);
            } catch (error) {
              this._destroy();
              throw error;
            }
          }
          if (this._killPacket) {
            this._destroy();
            let killPacket = this._killPacket;
            delete this._killPacket;
            return killPacket;
          }
          this.currentNode = this.currentNode.next;
          this.releaseBackpressure(this.currentNode.data);
          if (this.currentNode.consumerId && this.currentNode.consumerId !== this.id) {
            continue;
          }
          if (this.currentNode.data.done) {
            this._destroy();
          }
          return this.currentNode.data;
        }
      }
      return() {
        delete this.currentNode;
        this._destroy();
        return {};
      }
      [Symbol.asyncIterator]() {
        return this;
      }
    };
    function wait(timeout) {
      let timeoutId;
      let promise = new Promise((resolve) => {
        timeoutId = setTimeout(resolve, timeout);
      });
      return { timeoutId, promise };
    }
    module2.exports = Consumer;
  }
});

// ../../node_modules/.pnpm/writable-consumable-stream@4.2.0/node_modules/writable-consumable-stream/index.js
var require_writable_consumable_stream = __commonJS({
  "../../node_modules/.pnpm/writable-consumable-stream@4.2.0/node_modules/writable-consumable-stream/index.js"(exports2, module2) {
    var ConsumableStream = require_consumable_stream();
    var Consumer = require_consumer();
    var WritableConsumableStream = class extends ConsumableStream {
      constructor(options) {
        super();
        options = options || {};
        this._nextConsumerId = 1;
        this.generateConsumerId = options.generateConsumerId;
        if (!this.generateConsumerId) {
          this.generateConsumerId = () => this._nextConsumerId++;
        }
        this.removeConsumerCallback = options.removeConsumerCallback;
        this._consumers = /* @__PURE__ */ new Map();
        this.tailNode = {
          next: null,
          data: {
            value: void 0,
            done: false
          }
        };
      }
      _write(value, done, consumerId) {
        let dataNode = {
          data: { value, done },
          next: null
        };
        if (consumerId) {
          dataNode.consumerId = consumerId;
        }
        this.tailNode.next = dataNode;
        this.tailNode = dataNode;
        for (let consumer of this._consumers.values()) {
          consumer.write(dataNode.data);
        }
      }
      write(value) {
        this._write(value, false);
      }
      close(value) {
        this._write(value, true);
      }
      writeToConsumer(consumerId, value) {
        this._write(value, false, consumerId);
      }
      closeConsumer(consumerId, value) {
        this._write(value, true, consumerId);
      }
      kill(value) {
        for (let consumerId of this._consumers.keys()) {
          this.killConsumer(consumerId, value);
        }
      }
      killConsumer(consumerId, value) {
        let consumer = this._consumers.get(consumerId);
        if (!consumer) {
          return;
        }
        consumer.kill(value);
      }
      getBackpressure() {
        let maxBackpressure = 0;
        for (let consumer of this._consumers.values()) {
          let backpressure = consumer.getBackpressure();
          if (backpressure > maxBackpressure) {
            maxBackpressure = backpressure;
          }
        }
        return maxBackpressure;
      }
      getConsumerBackpressure(consumerId) {
        let consumer = this._consumers.get(consumerId);
        if (consumer) {
          return consumer.getBackpressure();
        }
        return 0;
      }
      hasConsumer(consumerId) {
        return this._consumers.has(consumerId);
      }
      setConsumer(consumerId, consumer) {
        this._consumers.set(consumerId, consumer);
        if (!consumer.currentNode) {
          consumer.currentNode = this.tailNode;
        }
      }
      removeConsumer(consumerId) {
        let result = this._consumers.delete(consumerId);
        if (this.removeConsumerCallback) this.removeConsumerCallback(consumerId);
        return result;
      }
      getConsumerStats(consumerId) {
        let consumer = this._consumers.get(consumerId);
        if (consumer) {
          return consumer.getStats();
        }
        return void 0;
      }
      getConsumerStatsList() {
        let consumerStats = [];
        for (let consumer of this._consumers.values()) {
          consumerStats.push(consumer.getStats());
        }
        return consumerStats;
      }
      createConsumer(timeout) {
        return new Consumer(this, this.generateConsumerId(), this.tailNode, timeout);
      }
      getConsumerList() {
        return [...this._consumers.values()];
      }
      getConsumerCount() {
        return this._consumers.size;
      }
    };
    module2.exports = WritableConsumableStream;
  }
});

// ../../node_modules/.pnpm/stream-demux@10.0.1/node_modules/stream-demux/demuxed-consumable-stream.js
var require_demuxed_consumable_stream = __commonJS({
  "../../node_modules/.pnpm/stream-demux@10.0.1/node_modules/stream-demux/demuxed-consumable-stream.js"(exports2, module2) {
    var ConsumableStream = require_consumable_stream();
    var DemuxedConsumableStream = class extends ConsumableStream {
      constructor(streamDemux, name) {
        super();
        this._streamDemux = streamDemux;
        this.name = name;
      }
      createConsumer(timeout) {
        return this._streamDemux.createConsumer(this.name, timeout);
      }
    };
    module2.exports = DemuxedConsumableStream;
  }
});

// ../../node_modules/.pnpm/stream-demux@10.0.1/node_modules/stream-demux/index.js
var require_stream_demux = __commonJS({
  "../../node_modules/.pnpm/stream-demux@10.0.1/node_modules/stream-demux/index.js"(exports2, module2) {
    var WritableConsumableStream = require_writable_consumable_stream();
    var DemuxedConsumableStream = require_demuxed_consumable_stream();
    var StreamDemux = class {
      constructor() {
        this.streams = {};
        this._nextConsumerId = 1;
        this.generateConsumerId = () => {
          return this._nextConsumerId++;
        };
      }
      write(streamName, value) {
        if (this.streams[streamName]) {
          this.streams[streamName].write(value);
        }
      }
      close(streamName, value) {
        if (this.streams[streamName]) {
          this.streams[streamName].close(value);
        }
      }
      closeAll(value) {
        for (let stream of Object.values(this.streams)) {
          stream.close(value);
        }
      }
      writeToConsumer(consumerId, value) {
        for (let stream of Object.values(this.streams)) {
          if (stream.hasConsumer(consumerId)) {
            return stream.writeToConsumer(consumerId, value);
          }
        }
      }
      closeConsumer(consumerId, value) {
        for (let stream of Object.values(this.streams)) {
          if (stream.hasConsumer(consumerId)) {
            return stream.closeConsumer(consumerId, value);
          }
        }
      }
      getConsumerStats(consumerId) {
        for (let [streamName, stream] of Object.entries(this.streams)) {
          if (stream.hasConsumer(consumerId)) {
            return {
              ...stream.getConsumerStats(consumerId),
              stream: streamName
            };
          }
        }
        return void 0;
      }
      getConsumerStatsList(streamName) {
        if (this.streams[streamName]) {
          return this.streams[streamName].getConsumerStatsList().map(
            (stats) => {
              return {
                ...stats,
                stream: streamName
              };
            }
          );
        }
        return [];
      }
      getConsumerStatsListAll() {
        let allStatsList = [];
        for (let streamName of Object.keys(this.streams)) {
          let statsList = this.getConsumerStatsList(streamName);
          for (let stats of statsList) {
            allStatsList.push(stats);
          }
        }
        return allStatsList;
      }
      kill(streamName, value) {
        if (this.streams[streamName]) {
          this.streams[streamName].kill(value);
        }
      }
      killAll(value) {
        for (let stream of Object.values(this.streams)) {
          stream.kill(value);
        }
      }
      killConsumer(consumerId, value) {
        for (let stream of Object.values(this.streams)) {
          if (stream.hasConsumer(consumerId)) {
            return stream.killConsumer(consumerId, value);
          }
        }
      }
      getBackpressure(streamName) {
        if (this.streams[streamName]) {
          return this.streams[streamName].getBackpressure();
        }
        return 0;
      }
      getBackpressureAll() {
        return Object.values(this.streams).reduce(
          (max, stream) => Math.max(max, stream.getBackpressure()),
          0
        );
      }
      getConsumerBackpressure(consumerId) {
        for (let stream of Object.values(this.streams)) {
          if (stream.hasConsumer(consumerId)) {
            return stream.getConsumerBackpressure(consumerId);
          }
        }
        return 0;
      }
      hasConsumer(streamName, consumerId) {
        if (this.streams[streamName]) {
          return this.streams[streamName].hasConsumer(consumerId);
        }
        return false;
      }
      hasConsumerAll(consumerId) {
        return Object.values(this.streams).some((stream) => stream.hasConsumer(consumerId));
      }
      getConsumerCount(streamName) {
        if (this.streams[streamName]) {
          return this.streams[streamName].getConsumerCount();
        }
        return 0;
      }
      getConsumerCountAll() {
        return Object.values(this.streams).reduce(
          (sum, stream) => sum + stream.getConsumerCount(),
          0
        );
      }
      createConsumer(streamName, timeout) {
        if (!this.streams[streamName]) {
          this.streams[streamName] = new WritableConsumableStream({
            generateConsumerId: this.generateConsumerId,
            removeConsumerCallback: () => {
              if (!this.getConsumerCount(streamName)) {
                delete this.streams[streamName];
              }
            }
          });
        }
        return this.streams[streamName].createConsumer(timeout);
      }
      // Unlike individual consumers, consumable streams support being iterated
      // over by multiple for-await-of loops in parallel.
      stream(streamName) {
        return new DemuxedConsumableStream(this, streamName);
      }
      unstream(streamName) {
        delete this.streams[streamName];
      }
    };
    module2.exports = StreamDemux;
  }
});

// ../../node_modules/.pnpm/async-stream-emitter@7.0.1/node_modules/async-stream-emitter/index.js
var require_async_stream_emitter = __commonJS({
  "../../node_modules/.pnpm/async-stream-emitter@7.0.1/node_modules/async-stream-emitter/index.js"(exports2, module2) {
    var StreamDemux = require_stream_demux();
    function AsyncStreamEmitter(options) {
      this._listenerDemux = new StreamDemux();
    }
    AsyncStreamEmitter.prototype.emit = function(eventName, data) {
      this._listenerDemux.write(eventName, data);
    };
    AsyncStreamEmitter.prototype.listener = function(eventName) {
      return this._listenerDemux.stream(eventName);
    };
    AsyncStreamEmitter.prototype.closeListener = function(eventName) {
      this._listenerDemux.close(eventName);
    };
    AsyncStreamEmitter.prototype.closeAllListeners = function() {
      this._listenerDemux.closeAll();
    };
    AsyncStreamEmitter.prototype.removeListener = function(eventName) {
      this._listenerDemux.unstream(eventName);
    };
    AsyncStreamEmitter.prototype.getListenerConsumerStats = function(consumerId) {
      return this._listenerDemux.getConsumerStats(consumerId);
    };
    AsyncStreamEmitter.prototype.getListenerConsumerStatsList = function(eventName) {
      return this._listenerDemux.getConsumerStatsList(eventName);
    };
    AsyncStreamEmitter.prototype.getAllListenersConsumerStatsList = function() {
      return this._listenerDemux.getConsumerStatsListAll();
    };
    AsyncStreamEmitter.prototype.getListenerConsumerCount = function(eventName) {
      return this._listenerDemux.getConsumerCount(eventName);
    };
    AsyncStreamEmitter.prototype.getAllListenersConsumerCount = function() {
      return this._listenerDemux.getConsumerCountAll();
    };
    AsyncStreamEmitter.prototype.killListener = function(eventName) {
      this._listenerDemux.kill(eventName);
    };
    AsyncStreamEmitter.prototype.killAllListeners = function() {
      this._listenerDemux.killAll();
    };
    AsyncStreamEmitter.prototype.killListenerConsumer = function(consumerId) {
      this._listenerDemux.killConsumer(consumerId);
    };
    AsyncStreamEmitter.prototype.getListenerBackpressure = function(eventName) {
      return this._listenerDemux.getBackpressure(eventName);
    };
    AsyncStreamEmitter.prototype.getAllListenersBackpressure = function() {
      return this._listenerDemux.getBackpressureAll();
    };
    AsyncStreamEmitter.prototype.getListenerConsumerBackpressure = function(consumerId) {
      return this._listenerDemux.getConsumerBackpressure(consumerId);
    };
    AsyncStreamEmitter.prototype.hasListenerConsumer = function(eventName, consumerId) {
      return this._listenerDemux.hasConsumer(eventName, consumerId);
    };
    AsyncStreamEmitter.prototype.hasAnyListenerConsumer = function(consumerId) {
      return this._listenerDemux.hasConsumerAll(consumerId);
    };
    module2.exports = AsyncStreamEmitter;
  }
});

// ../../node_modules/.pnpm/sc-errors@3.0.0/node_modules/sc-errors/decycle.js
var require_decycle = __commonJS({
  "../../node_modules/.pnpm/sc-errors@3.0.0/node_modules/sc-errors/decycle.js"(exports2, module2) {
    module2.exports = function decycle(object) {
      var objects = [], paths = [];
      return function derez(value, path2) {
        var i, name, nu;
        if (typeof value === "object" && value !== null && !(value instanceof Boolean) && !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) && !(value instanceof String)) {
          for (i = 0; i < objects.length; i += 1) {
            if (objects[i] === value) {
              return { $ref: paths[i] };
            }
          }
          objects.push(value);
          paths.push(path2);
          if (Object.prototype.toString.apply(value) === "[object Array]") {
            nu = [];
            for (i = 0; i < value.length; i += 1) {
              nu[i] = derez(value[i], path2 + "[" + i + "]");
            }
          } else {
            nu = {};
            for (name in value) {
              if (Object.prototype.hasOwnProperty.call(value, name)) {
                nu[name] = derez(
                  value[name],
                  path2 + "[" + JSON.stringify(name) + "]"
                );
              }
            }
          }
          return nu;
        }
        return value;
      }(object, "$");
    };
  }
});

// ../../node_modules/.pnpm/sc-errors@3.0.0/node_modules/sc-errors/index.js
var require_sc_errors = __commonJS({
  "../../node_modules/.pnpm/sc-errors@3.0.0/node_modules/sc-errors/index.js"(exports2, module2) {
    var decycle = require_decycle();
    var isStrict = /* @__PURE__ */ function() {
      return !this;
    }();
    function AuthTokenExpiredError(message, expiry) {
      this.name = "AuthTokenExpiredError";
      this.message = message;
      this.expiry = expiry;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    AuthTokenExpiredError.prototype = Object.create(Error.prototype);
    function AuthTokenInvalidError(message) {
      this.name = "AuthTokenInvalidError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    AuthTokenInvalidError.prototype = Object.create(Error.prototype);
    function AuthTokenNotBeforeError(message, date) {
      this.name = "AuthTokenNotBeforeError";
      this.message = message;
      this.date = date;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    AuthTokenNotBeforeError.prototype = Object.create(Error.prototype);
    function AuthTokenError(message) {
      this.name = "AuthTokenError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    AuthTokenError.prototype = Object.create(Error.prototype);
    function AuthError(message) {
      this.name = "AuthError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    AuthError.prototype = Object.create(Error.prototype);
    function SilentMiddlewareBlockedError(message, type) {
      this.name = "SilentMiddlewareBlockedError";
      this.message = message;
      this.type = type;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    SilentMiddlewareBlockedError.prototype = Object.create(Error.prototype);
    function InvalidActionError(message) {
      this.name = "InvalidActionError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    InvalidActionError.prototype = Object.create(Error.prototype);
    function InvalidArgumentsError(message) {
      this.name = "InvalidArgumentsError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    InvalidArgumentsError.prototype = Object.create(Error.prototype);
    function InvalidOptionsError(message) {
      this.name = "InvalidOptionsError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    InvalidOptionsError.prototype = Object.create(Error.prototype);
    function InvalidMessageError(message) {
      this.name = "InvalidMessageError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    InvalidMessageError.prototype = Object.create(Error.prototype);
    function SocketProtocolError(message, code) {
      this.name = "SocketProtocolError";
      this.message = message;
      this.code = code;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    SocketProtocolError.prototype = Object.create(Error.prototype);
    function ServerProtocolError(message) {
      this.name = "ServerProtocolError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    ServerProtocolError.prototype = Object.create(Error.prototype);
    function HTTPServerError(message) {
      this.name = "HTTPServerError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    HTTPServerError.prototype = Object.create(Error.prototype);
    function ResourceLimitError(message) {
      this.name = "ResourceLimitError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    ResourceLimitError.prototype = Object.create(Error.prototype);
    function TimeoutError(message) {
      this.name = "TimeoutError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    TimeoutError.prototype = Object.create(Error.prototype);
    function BadConnectionError(message, type, code, reason) {
      this.name = "BadConnectionError";
      this.message = message;
      this.type = type;
      this.code = code || 1001;
      this.reason = reason || socketProtocolIgnoreStatuses[this.code] || "";
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    BadConnectionError.prototype = Object.create(Error.prototype);
    function BrokerError(message) {
      this.name = "BrokerError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    BrokerError.prototype = Object.create(Error.prototype);
    function ProcessExitError(message, code) {
      this.name = "ProcessExitError";
      this.message = message;
      this.code = code;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    ProcessExitError.prototype = Object.create(Error.prototype);
    function UnknownError(message) {
      this.name = "UnknownError";
      this.message = message;
      if (Error.captureStackTrace && !isStrict) {
        Error.captureStackTrace(this, arguments.callee);
      } else {
        this.stack = new Error().stack;
      }
    }
    UnknownError.prototype = Object.create(Error.prototype);
    module2.exports = {
      AuthTokenExpiredError,
      AuthTokenInvalidError,
      AuthTokenNotBeforeError,
      AuthTokenError,
      AuthError,
      SilentMiddlewareBlockedError,
      InvalidActionError,
      InvalidArgumentsError,
      InvalidOptionsError,
      InvalidMessageError,
      SocketProtocolError,
      ServerProtocolError,
      HTTPServerError,
      ResourceLimitError,
      TimeoutError,
      BadConnectionError,
      BrokerError,
      ProcessExitError,
      UnknownError
    };
    var socketProtocolErrorStatuses = {
      1001: "Socket was disconnected",
      1002: "A WebSocket protocol error was encountered",
      1003: "Server terminated socket because it received invalid data",
      1005: "Socket closed without status code",
      1006: "Socket hung up",
      1007: "Message format was incorrect",
      1008: "Encountered a policy violation",
      1009: "Message was too big to process",
      1010: "Client ended the connection because the server did not comply with extension requirements",
      1011: "Server encountered an unexpected fatal condition",
      4e3: "Server ping timed out",
      4001: "Client pong timed out",
      4002: "Server failed to sign auth token",
      4003: "Failed to complete handshake",
      4004: "Client failed to save auth token",
      4005: "Did not receive #handshake from client before timeout",
      4006: "Failed to bind socket to message broker",
      4007: "Client connection establishment timed out",
      4008: "Server rejected handshake from client",
      4009: "Server received a message before the client handshake"
    };
    var socketProtocolIgnoreStatuses = {
      1e3: "Socket closed normally",
      1001: socketProtocolErrorStatuses[1001]
    };
    module2.exports.socketProtocolErrorStatuses = socketProtocolErrorStatuses;
    module2.exports.socketProtocolIgnoreStatuses = socketProtocolIgnoreStatuses;
    module2.exports.dehydrateError = function dehydrateError(error) {
      let dehydratedError;
      if (error && typeof error === "object") {
        dehydratedError = {
          message: error.message
        };
        for (let i of Object.keys(error)) {
          dehydratedError[i] = error[i];
        }
      } else if (typeof error === "function") {
        dehydratedError = "[function " + (typeof error.name === "string" ? error.name : "anonymous") + "]";
      } else {
        dehydratedError = error;
      }
      return decycle(dehydratedError);
    };
    module2.exports.hydrateError = function hydrateError(error) {
      let hydratedError = null;
      if (error != null) {
        if (typeof error === "object") {
          hydratedError = new Error(
            typeof error.message === "string" ? error.message : "Invalid error message format"
          );
          if (typeof error.name === "string") {
            hydratedError.name = error.name;
          }
          for (let i of Object.keys(error)) {
            if (hydratedError[i] === void 0) {
              hydratedError[i] = error[i];
            }
          }
        } else {
          hydratedError = error;
        }
      }
      return hydratedError;
    };
    module2.exports.decycle = decycle;
  }
});

// ../../node_modules/.pnpm/socketcluster-server@19.2.2/node_modules/socketcluster-server/action.js
var require_action = __commonJS({
  "../../node_modules/.pnpm/socketcluster-server@19.2.2/node_modules/socketcluster-server/action.js"(exports2, module2) {
    var scErrors = require_sc_errors();
    var InvalidActionError = scErrors.InvalidActionError;
    function AGAction() {
      this.outcome = null;
      this.promise = new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
      this.allow = (packet) => {
        if (this.outcome) {
          throw new InvalidActionError(`AGAction ${this.type} has already been ${this.outcome}; cannot allow`);
        }
        this.outcome = "allowed";
        this._resolve(packet);
      };
      this.block = (error) => {
        if (this.outcome) {
          throw new InvalidActionError(`AGAction ${this.type} has already been ${this.outcome}; cannot block`);
        }
        this.outcome = "blocked";
        this._reject(error);
      };
    }
    AGAction.prototype.HANDSHAKE_WS = AGAction.HANDSHAKE_WS = "handshakeWS";
    AGAction.prototype.HANDSHAKE_SC = AGAction.HANDSHAKE_SC = "handshakeSC";
    AGAction.prototype.MESSAGE = AGAction.MESSAGE = "message";
    AGAction.prototype.TRANSMIT = AGAction.TRANSMIT = "transmit";
    AGAction.prototype.INVOKE = AGAction.INVOKE = "invoke";
    AGAction.prototype.SUBSCRIBE = AGAction.SUBSCRIBE = "subscribe";
    AGAction.prototype.PUBLISH_IN = AGAction.PUBLISH_IN = "publishIn";
    AGAction.prototype.PUBLISH_OUT = AGAction.PUBLISH_OUT = "publishOut";
    AGAction.prototype.AUTHENTICATE = AGAction.AUTHENTICATE = "authenticate";
    module2.exports = AGAction;
  }
});

// ../../node_modules/.pnpm/ag-request@1.1.0/node_modules/ag-request/index.js
var require_ag_request = __commonJS({
  "../../node_modules/.pnpm/ag-request@1.1.0/node_modules/ag-request/index.js"(exports2, module2) {
    var scErrors = require_sc_errors();
    var InvalidActionError = scErrors.InvalidActionError;
    function AGRequest(socket, id, procedureName, data) {
      this.socket = socket;
      this.id = id;
      this.procedure = procedureName;
      this.data = data;
      this.sent = false;
      this._respond = (responseData, options) => {
        if (this.sent) {
          throw new InvalidActionError(`Response to request ${this.id} has already been sent`);
        }
        this.sent = true;
        this.socket.sendObject(responseData, options);
      };
      this.end = (data2, options) => {
        let responseData = {
          rid: this.id
        };
        if (data2 !== void 0) {
          responseData.data = data2;
        }
        this._respond(responseData, options);
      };
      this.error = (error, options) => {
        let responseData = {
          rid: this.id,
          error: scErrors.dehydrateError(error)
        };
        this._respond(responseData, options);
      };
    }
    module2.exports = AGRequest;
  }
});

// ../../node_modules/.pnpm/socketcluster-server@19.2.2/node_modules/socketcluster-server/serversocket.js
var require_serversocket = __commonJS({
  "../../node_modules/.pnpm/socketcluster-server@19.2.2/node_modules/socketcluster-server/serversocket.js"(exports2, module2) {
    var cloneDeep = require_clone_deep();
    var WritableConsumableStream = require_writable_consumable_stream();
    var StreamDemux = require_stream_demux();
    var AsyncStreamEmitter = require_async_stream_emitter();
    var AGAction = require_action();
    var AGRequest = require_ag_request();
    var scErrors = require_sc_errors();
    var InvalidArgumentsError = scErrors.InvalidArgumentsError;
    var SocketProtocolError = scErrors.SocketProtocolError;
    var TimeoutError = scErrors.TimeoutError;
    var BadConnectionError = scErrors.BadConnectionError;
    var InvalidActionError = scErrors.InvalidActionError;
    var AuthError = scErrors.AuthError;
    var AuthTokenExpiredError = scErrors.AuthTokenExpiredError;
    var AuthTokenInvalidError = scErrors.AuthTokenInvalidError;
    var AuthTokenNotBeforeError = scErrors.AuthTokenNotBeforeError;
    var AuthTokenError = scErrors.AuthTokenError;
    var BrokerError = scErrors.BrokerError;
    var HANDSHAKE_REJECTION_STATUS_CODE = 4008;
    var PONG_RESET_FREQUENCY_DIVISOR = 4;
    function AGServerSocket(id, server, socket, protocolVersion) {
      AsyncStreamEmitter.call(this);
      this.id = id;
      this.server = server;
      this.socket = socket;
      this.state = this.CONNECTING;
      this.authState = this.UNAUTHENTICATED;
      this.protocolVersion = protocolVersion;
      this._receiverDemux = new StreamDemux();
      this._procedureDemux = new StreamDemux();
      this.request = this.socket.upgradeReq;
      this.inboundReceivedMessageCount = 0;
      this.inboundProcessedMessageCount = 0;
      this.outboundPreparedMessageCount = 0;
      this.outboundSentMessageCount = 0;
      this.createRequest = this.server.options.requestCreator || this.defaultRequestCreator;
      this.cloneData = this.server.options.cloneData;
      this.inboundMessageStream = new WritableConsumableStream();
      this.outboundPacketStream = new WritableConsumableStream();
      this.middlewareHandshakeStream = this.request[this.server.SYMBOL_MIDDLEWARE_HANDSHAKE_STREAM];
      this.middlewareInboundRawStream = new WritableConsumableStream();
      this.middlewareInboundRawStream.type = this.server.MIDDLEWARE_INBOUND_RAW;
      this.middlewareInboundStream = new WritableConsumableStream();
      this.middlewareInboundStream.type = this.server.MIDDLEWARE_INBOUND;
      this.middlewareOutboundStream = new WritableConsumableStream();
      this.middlewareOutboundStream.type = this.server.MIDDLEWARE_OUTBOUND;
      if (this.request.connection) {
        this.remoteAddress = this.request.connection.remoteAddress;
        this.remoteFamily = this.request.connection.remoteFamily;
        this.remotePort = this.request.connection.remotePort;
      } else {
        this.remoteAddress = this.request.remoteAddress;
        this.remoteFamily = this.request.remoteFamily;
        this.remotePort = this.request.remotePort;
      }
      if (this.request.forwardedForAddress) {
        this.forwardedForAddress = this.request.forwardedForAddress;
      }
      this.isBufferingBatch = false;
      this.isBatching = false;
      this.batchOnHandshake = this.server.options.batchOnHandshake;
      this.batchOnHandshakeDuration = this.server.options.batchOnHandshakeDuration;
      this.batchInterval = this.server.options.batchInterval;
      this._batchBuffer = [];
      this._batchingIntervalId = null;
      this._cid = 1;
      this._callbackMap = {};
      this._lastPongResetTime = 0;
      this.channelSubscriptions = {};
      this.channelSubscriptionsCount = 0;
      this.socket.on("error", (err) => {
        this.emitError(err);
      });
      this.socket.on("close", (code, reasonBuffer) => {
        let reason = reasonBuffer.toString();
        this._destroy(code, reason);
      });
      let pongMessage;
      if (this.protocolVersion === 1) {
        pongMessage = "#2";
        this._sendPing = () => {
          if (this.state !== this.CLOSED) {
            this.send("#1");
          }
        };
      } else {
        pongMessage = "";
        this._sendPing = () => {
          if (this.state !== this.CLOSED) {
            this.send("");
          }
        };
      }
      if (!this.server.pingTimeoutDisabled) {
        this._pingIntervalTicker = setInterval(() => {
          this._sendPing();
        }, this.server.pingInterval);
      }
      this._resetPongTimeout();
      this._handshakeTimeoutRef = setTimeout(() => {
        this._handleHandshakeTimeout();
      }, this.server.handshakeTimeout);
      this.server.pendingClients[this.id] = this;
      this.server.pendingClientsCount++;
      this._handleInboundMessageStream(pongMessage);
      this._handleOutboundPacketStream();
      this.socket.on("message", async (messageBuffer, isBinary) => {
        let message = isBinary ? messageBuffer : messageBuffer.toString();
        this.inboundReceivedMessageCount++;
        let isPong = message === pongMessage;
        if (isPong) {
          this._resetPongTimeout();
        } else {
          let now = Date.now();
          if (now - this._lastPongResetTime > this.server.pingTimeout / PONG_RESET_FREQUENCY_DIVISOR) {
            this._resetPongTimeout();
          }
        }
        if (this.server.hasMiddleware(this.server.MIDDLEWARE_INBOUND_RAW)) {
          let action = new AGAction();
          action.socket = this;
          action.type = AGAction.MESSAGE;
          action.data = message;
          try {
            let { data } = await this.server._processMiddlewareAction(this.middlewareInboundRawStream, action, this);
            message = data;
          } catch (error) {
            this.inboundProcessedMessageCount++;
            return;
          }
        }
        this.inboundMessageStream.write(message);
        this.emit("message", { message });
      });
    }
    AGServerSocket.prototype = Object.create(AsyncStreamEmitter.prototype);
    AGServerSocket.CONNECTING = AGServerSocket.prototype.CONNECTING = "connecting";
    AGServerSocket.OPEN = AGServerSocket.prototype.OPEN = "open";
    AGServerSocket.CLOSED = AGServerSocket.prototype.CLOSED = "closed";
    AGServerSocket.AUTHENTICATED = AGServerSocket.prototype.AUTHENTICATED = "authenticated";
    AGServerSocket.UNAUTHENTICATED = AGServerSocket.prototype.UNAUTHENTICATED = "unauthenticated";
    AGServerSocket.ignoreStatuses = scErrors.socketProtocolIgnoreStatuses;
    AGServerSocket.errorStatuses = scErrors.socketProtocolErrorStatuses;
    AGServerSocket.prototype.getBackpressure = function() {
      return Math.max(
        this.getInboundBackpressure(),
        this.getOutboundBackpressure(),
        this.getAllListenersBackpressure(),
        this.getAllReceiversBackpressure(),
        this.getAllProceduresBackpressure()
      );
    };
    AGServerSocket.prototype.getInboundBackpressure = function() {
      return this.inboundReceivedMessageCount - this.inboundProcessedMessageCount;
    };
    AGServerSocket.prototype.getOutboundBackpressure = function() {
      return this.outboundPreparedMessageCount - this.outboundSentMessageCount;
    };
    AGServerSocket.prototype._startBatchOnHandshake = function() {
      this._startBatching();
      setTimeout(() => {
        if (!this.isBatching) {
          this._stopBatching();
        }
      }, this.batchOnHandshakeDuration);
    };
    AGServerSocket.prototype.defaultRequestCreator = function(socket, id, procedureName, data) {
      return new AGRequest(socket, id, procedureName, data);
    };
    AGServerSocket.prototype.receiver = function(receiverName) {
      return this._receiverDemux.stream(receiverName);
    };
    AGServerSocket.prototype.closeReceiver = function(receiverName) {
      this._receiverDemux.close(receiverName);
    };
    AGServerSocket.prototype.closeAllReceivers = function() {
      this._receiverDemux.closeAll();
    };
    AGServerSocket.prototype.killReceiver = function(receiverName) {
      this._receiverDemux.kill(receiverName);
    };
    AGServerSocket.prototype.killAllReceivers = function() {
      this._receiverDemux.killAll();
    };
    AGServerSocket.prototype.killReceiverConsumer = function(consumerId) {
      this._receiverDemux.killConsumer(consumerId);
    };
    AGServerSocket.prototype.getReceiverConsumerStats = function(consumerId) {
      return this._receiverDemux.getConsumerStats(consumerId);
    };
    AGServerSocket.prototype.getReceiverConsumerStatsList = function(receiverName) {
      return this._receiverDemux.getConsumerStatsList(receiverName);
    };
    AGServerSocket.prototype.getAllReceiversConsumerStatsList = function() {
      return this._receiverDemux.getConsumerStatsListAll();
    };
    AGServerSocket.prototype.getReceiverBackpressure = function(receiverName) {
      return this._receiverDemux.getBackpressure(receiverName);
    };
    AGServerSocket.prototype.getAllReceiversBackpressure = function() {
      return this._receiverDemux.getBackpressureAll();
    };
    AGServerSocket.prototype.getReceiverConsumerBackpressure = function(consumerId) {
      return this._receiverDemux.getConsumerBackpressure(consumerId);
    };
    AGServerSocket.prototype.hasReceiverConsumer = function(receiverName, consumerId) {
      return this._receiverDemux.hasConsumer(receiverName, consumerId);
    };
    AGServerSocket.prototype.hasAnyReceiverConsumer = function(consumerId) {
      return this._receiverDemux.hasConsumerAll(consumerId);
    };
    AGServerSocket.prototype.procedure = function(procedureName) {
      return this._procedureDemux.stream(procedureName);
    };
    AGServerSocket.prototype.closeProcedure = function(procedureName) {
      this._procedureDemux.close(procedureName);
    };
    AGServerSocket.prototype.closeAllProcedures = function() {
      this._procedureDemux.closeAll();
    };
    AGServerSocket.prototype.killProcedure = function(procedureName) {
      this._procedureDemux.kill(procedureName);
    };
    AGServerSocket.prototype.killAllProcedures = function() {
      this._procedureDemux.killAll();
    };
    AGServerSocket.prototype.killProcedureConsumer = function(consumerId) {
      this._procedureDemux.killConsumer(consumerId);
    };
    AGServerSocket.prototype.getProcedureConsumerStats = function(consumerId) {
      return this._procedureDemux.getConsumerStats(consumerId);
    };
    AGServerSocket.prototype.getProcedureConsumerStatsList = function(procedureName) {
      return this._procedureDemux.getConsumerStatsList(procedureName);
    };
    AGServerSocket.prototype.getAllProceduresConsumerStatsList = function() {
      return this._procedureDemux.getConsumerStatsListAll();
    };
    AGServerSocket.prototype.getProcedureBackpressure = function(procedureName) {
      return this._procedureDemux.getBackpressure(procedureName);
    };
    AGServerSocket.prototype.getAllProceduresBackpressure = function() {
      return this._procedureDemux.getBackpressureAll();
    };
    AGServerSocket.prototype.getProcedureConsumerBackpressure = function(consumerId) {
      return this._procedureDemux.getConsumerBackpressure(consumerId);
    };
    AGServerSocket.prototype.hasProcedureConsumer = function(procedureName, consumerId) {
      return this._procedureDemux.hasConsumer(procedureName, consumerId);
    };
    AGServerSocket.prototype.hasAnyProcedureConsumer = function(consumerId) {
      return this._procedureDemux.hasConsumerAll(consumerId);
    };
    AGServerSocket.prototype._handleInboundMessageStream = async function(pongMessage) {
      for await (let message of this.inboundMessageStream) {
        this.inboundProcessedMessageCount++;
        let isPong = message === pongMessage;
        if (isPong) {
          if (this.server.strictHandshake && this.state === this.CONNECTING) {
            this._destroy(4009);
            this.socket.close(4009);
            continue;
          }
          let token = this.getAuthToken();
          if (this.isAuthTokenExpired(token)) {
            this.deauthenticate();
          }
          continue;
        }
        let packet;
        try {
          packet = this.decode(message);
        } catch (error) {
          if (error.name === "Error") {
            error.name = "InvalidMessageError";
          }
          this.emitError(error);
          if (this.server.strictHandshake && this.state === this.CONNECTING) {
            this._destroy(4009);
            this.socket.close(4009);
          }
          continue;
        }
        if (Array.isArray(packet)) {
          let len = packet.length;
          for (let i = 0; i < len; i++) {
            await this._processInboundPacket(packet[i], message);
          }
        } else {
          await this._processInboundPacket(packet, message);
        }
      }
    };
    AGServerSocket.prototype._handleHandshakeTimeout = function() {
      this.disconnect(4005);
    };
    AGServerSocket.prototype._processHandshakeRequest = async function(request) {
      let data = request.data || {};
      let signedAuthToken = data.authToken || null;
      clearTimeout(this._handshakeTimeoutRef);
      let authInfo = await this._validateAuthToken(signedAuthToken);
      let action = new AGAction();
      action.request = this.request;
      action.socket = this;
      action.type = AGAction.HANDSHAKE_SC;
      action.data = authInfo;
      try {
        await this.server._processMiddlewareAction(this.middlewareHandshakeStream, action);
      } catch (error) {
        if (error.statusCode == null) {
          error.statusCode = HANDSHAKE_REJECTION_STATUS_CODE;
        }
        request.error(error);
        this.disconnect(error.statusCode);
        return;
      }
      let clientSocketStatus = {
        id: this.id,
        pingTimeout: this.server.pingTimeout
      };
      let serverSocketStatus = {
        id: this.id,
        pingTimeout: this.server.pingTimeout
      };
      let oldAuthState = this.authState;
      try {
        await this._processAuthentication(authInfo);
        if (this.state === this.CLOSED) {
          return;
        }
      } catch (error) {
        if (signedAuthToken != null) {
          clientSocketStatus.authError = scErrors.dehydrateError(error);
          serverSocketStatus.authError = error;
          if (error.isBadToken) {
            this.deauthenticate();
          }
        }
      }
      clientSocketStatus.isAuthenticated = !!this.authToken;
      serverSocketStatus.isAuthenticated = clientSocketStatus.isAuthenticated;
      if (this.server.pendingClients[this.id]) {
        delete this.server.pendingClients[this.id];
        this.server.pendingClientsCount--;
      }
      this.server.clients[this.id] = this;
      this.server.clientsCount++;
      this.state = this.OPEN;
      if (clientSocketStatus.isAuthenticated) {
        (async () => {
          await this.listener("connect").once();
          this.triggerAuthenticationEvents(oldAuthState);
        })();
      }
      request.end(clientSocketStatus);
      if (this.batchOnHandshake) {
        this._startBatchOnHandshake();
      }
      this.emit("connect", serverSocketStatus);
      this.server.emit("connection", { socket: this, ...serverSocketStatus });
      this.middlewareHandshakeStream.close();
    };
    AGServerSocket.prototype._processAuthenticateRequest = async function(request) {
      let signedAuthToken = request.data;
      let oldAuthState = this.authState;
      let authInfo = await this._validateAuthToken(signedAuthToken);
      try {
        await this._processAuthentication(authInfo);
      } catch (error) {
        if (error.isBadToken) {
          this.deauthenticate();
          request.error(error);
          return;
        }
        request.end({
          isAuthenticated: !!this.authToken,
          authError: signedAuthToken == null ? null : scErrors.dehydrateError(error)
        });
        return;
      }
      this.triggerAuthenticationEvents(oldAuthState);
      request.end({
        isAuthenticated: !!this.authToken,
        authError: null
      });
    };
    AGServerSocket.prototype._subscribeSocket = async function(channelName, subscriptionOptions) {
      if (this.server.socketChannelLimit && this.channelSubscriptionsCount >= this.server.socketChannelLimit) {
        throw new InvalidActionError(
          `Socket ${this.id} tried to exceed the channel subscription limit of ${this.server.socketChannelLimit}`
        );
      }
      if (this.channelSubscriptionsCount == null) {
        this.channelSubscriptionsCount = 0;
      }
      if (this.channelSubscriptions[channelName] == null) {
        this.channelSubscriptions[channelName] = true;
        this.channelSubscriptionsCount++;
      }
      try {
        await this.server.brokerEngine.subscribeSocket(this, channelName);
      } catch (error) {
        delete this.channelSubscriptions[channelName];
        this.channelSubscriptionsCount--;
        throw error;
      }
      this.emit("subscribe", {
        channel: channelName,
        subscriptionOptions
      });
      this.server.emit("subscription", {
        socket: this,
        channel: channelName,
        subscriptionOptions
      });
    };
    AGServerSocket.prototype._processSubscribeRequest = async function(request) {
      if (this.state === this.OPEN) {
        let subscriptionOptions = Object.assign({}, request.data);
        let channelName = subscriptionOptions.channel;
        delete subscriptionOptions.channel;
        try {
          await this._subscribeSocket(channelName, subscriptionOptions);
        } catch (err) {
          let error2 = new BrokerError(`Failed to subscribe socket to the ${channelName} channel - ${err}`);
          this.emitError(error2);
          request.error(error2);
          return;
        }
        request.end();
        return;
      }
      let error = new InvalidActionError("Cannot subscribe socket to a channel before it has completed the handshake");
      this.emitError(error);
      request.error(error);
    };
    AGServerSocket.prototype._unsubscribeFromAllChannels = function() {
      const channels = Object.keys(this.channelSubscriptions);
      return Promise.all(channels.map((channel) => this._unsubscribe(channel)));
    };
    AGServerSocket.prototype._unsubscribe = async function(channel) {
      if (!this.channelSubscriptions[channel]) {
        throw new InvalidActionError(
          `Socket ${this.id} tried to unsubscribe from a channel which it is not subscribed to`
        );
      }
      try {
        await this.server.brokerEngine.unsubscribeSocket(this, channel);
        delete this.channelSubscriptions[channel];
        if (this.channelSubscriptionsCount != null) {
          this.channelSubscriptionsCount--;
        }
        this.emit("unsubscribe", { channel });
        this.server.emit("unsubscription", { socket: this, channel });
      } catch (err) {
        const error = new BrokerError(
          `Failed to unsubscribe socket from the ${channel} channel - ${err}`
        );
        this.emitError(error);
      }
    };
    AGServerSocket.prototype._processUnsubscribePacket = async function(packet) {
      let channel = packet.data;
      try {
        await this._unsubscribe(channel);
      } catch (err) {
        let error = new BrokerError(
          `Failed to unsubscribe socket from the ${channel} channel - ${err}`
        );
        this.emitError(error);
      }
    };
    AGServerSocket.prototype._processUnsubscribeRequest = async function(request) {
      let channel = request.data;
      try {
        await this._unsubscribe(channel);
      } catch (err) {
        let error = new BrokerError(
          `Failed to unsubscribe socket from the ${channel} channel - ${err}`
        );
        this.emitError(error);
        request.error(error);
        return;
      }
      request.end();
    };
    AGServerSocket.prototype._processInboundPublishPacket = async function(packet) {
      try {
        await this.server.exchange.invokePublish(packet.data.channel, packet.data.data);
      } catch (error) {
        this.emitError(error);
      }
    };
    AGServerSocket.prototype._processInboundPublishRequest = async function(request) {
      try {
        await this.server.exchange.invokePublish(request.data.channel, request.data.data);
      } catch (error) {
        this.emitError(error);
        request.error(error);
        return;
      }
      request.end();
    };
    AGServerSocket.prototype._processInboundPacket = async function(packet, message) {
      if (packet && typeof packet.event === "string") {
        let eventName = packet.event;
        let isRPC = typeof packet.cid === "number";
        if (eventName === "#handshake") {
          if (!isRPC) {
            let error = new InvalidActionError("Handshake request was malformatted");
            this.emitError(error);
            this._destroy(HANDSHAKE_REJECTION_STATUS_CODE);
            this.socket.close(HANDSHAKE_REJECTION_STATUS_CODE);
            return;
          }
          let request = this.createRequest(this, packet.cid, eventName, packet.data);
          await this._processHandshakeRequest(request);
          this._procedureDemux.write(eventName, request);
          return;
        }
        if (this.server.strictHandshake && this.state === this.CONNECTING) {
          this._destroy(4009);
          this.socket.close(4009);
          return;
        }
        if (eventName === "#authenticate") {
          if (!isRPC) {
            let error = new InvalidActionError("Authenticate request was malformatted");
            this.emitError(error);
            this._destroy(HANDSHAKE_REJECTION_STATUS_CODE);
            this.socket.close(HANDSHAKE_REJECTION_STATUS_CODE);
            return;
          }
          let request = this.createRequest(this, packet.cid, eventName, packet.data);
          await this._processAuthenticateRequest(request);
          this._procedureDemux.write(eventName, request);
          return;
        }
        if (eventName === "#removeAuthToken") {
          this.deauthenticateSelf();
          this._receiverDemux.write(eventName, packet.data);
          return;
        }
        let action = new AGAction();
        action.socket = this;
        let tokenExpiredError = this._processAuthTokenExpiry();
        if (tokenExpiredError) {
          action.authTokenExpiredError = tokenExpiredError;
        }
        let isPublish = eventName === "#publish";
        let isSubscribe = eventName === "#subscribe";
        let isUnsubscribe = eventName === "#unsubscribe";
        if (isPublish) {
          if (!this.server.allowClientPublish) {
            let error = new InvalidActionError("Client publish feature is disabled");
            this.emitError(error);
            if (isRPC) {
              let request = this.createRequest(this, packet.cid, eventName, packet.data);
              request.error(error);
            }
            return;
          }
          if (!packet.data || typeof packet.data.channel !== "string") {
            let error = new InvalidActionError("Publish channel name was malformatted");
            this.emitError(error);
            if (isRPC) {
              let request = this.createRequest(this, packet.cid, eventName, packet.data);
              request.error(error);
            }
            return;
          }
          action.type = AGAction.PUBLISH_IN;
          action.channel = packet.data.channel;
          action.data = packet.data.data;
        } else if (isSubscribe) {
          if (!packet.data || typeof packet.data.channel !== "string") {
            let error = new InvalidActionError("Subscribe channel name was malformatted");
            this.emitError(error);
            if (isRPC) {
              let request = this.createRequest(this, packet.cid, eventName, packet.data);
              request.error(error);
            }
            return;
          }
          action.type = AGAction.SUBSCRIBE;
          action.channel = packet.data.channel;
          action.data = packet.data.data;
        } else if (isUnsubscribe) {
          if (typeof packet.data !== "string") {
            let error = new InvalidActionError("Unsubscribe channel name was malformatted");
            this.emitError(error);
            if (isRPC) {
              let request = this.createRequest(this, packet.cid, eventName, packet.data);
              request.error(error);
            }
            return;
          }
          if (isRPC) {
            let request = this.createRequest(this, packet.cid, eventName, packet.data);
            await this._processUnsubscribeRequest(request);
            this._procedureDemux.write(eventName, request);
            return;
          }
          await this._processUnsubscribePacket(packet);
          this._receiverDemux.write(eventName, packet.data);
          return;
        } else {
          if (isRPC) {
            action.type = AGAction.INVOKE;
            action.procedure = packet.event;
            if (packet.data !== void 0) {
              action.data = packet.data;
            }
          } else {
            action.type = AGAction.TRANSMIT;
            action.receiver = packet.event;
            if (packet.data !== void 0) {
              action.data = packet.data;
            }
          }
        }
        let newData;
        if (isRPC) {
          let request = this.createRequest(this, packet.cid, eventName, packet.data);
          try {
            let { data } = await this.server._processMiddlewareAction(this.middlewareInboundStream, action, this);
            newData = data;
          } catch (error) {
            request.error(error);
            return;
          }
          if (isSubscribe) {
            request.data.data = newData;
            await this._processSubscribeRequest(request);
          } else if (isPublish) {
            request.data.data = newData;
            await this._processInboundPublishRequest(request);
          } else {
            request.data = newData;
          }
          this._procedureDemux.write(eventName, request);
          return;
        }
        try {
          let { data } = await this.server._processMiddlewareAction(this.middlewareInboundStream, action, this);
          newData = data;
        } catch (error) {
          return;
        }
        if (isPublish) {
          packet.data.data = newData;
          await this._processInboundPublishPacket(packet);
        }
        this._receiverDemux.write(eventName, newData);
        return;
      }
      if (this.server.strictHandshake && this.state === this.CONNECTING) {
        this._destroy(4009);
        this.socket.close(4009);
        return;
      }
      if (packet && typeof packet.rid === "number") {
        let ret = this._callbackMap[packet.rid];
        if (ret) {
          clearTimeout(ret.timeout);
          delete this._callbackMap[packet.rid];
          let rehydratedError = scErrors.hydrateError(packet.error);
          ret.callback(rehydratedError, packet.data);
        }
        return;
      }
      this.emit("raw", { message });
    };
    AGServerSocket.prototype._resetPongTimeout = function() {
      if (this.server.pingTimeoutDisabled) {
        return;
      }
      clearTimeout(this._pingTimeoutTicker);
      this._pingTimeoutTicker = setTimeout(() => {
        this._destroy(4001);
        this.socket.close(4001);
      }, this.server.pingTimeout);
      this._lastPongResetTime = Date.now();
    };
    AGServerSocket.prototype._nextCallId = function() {
      return this._cid++;
    };
    AGServerSocket.prototype.getState = function() {
      return this.state;
    };
    AGServerSocket.prototype.getBytesReceived = function() {
      return this.socket.bytesReceived;
    };
    AGServerSocket.prototype.emitError = function(error) {
      this.emit("error", { error });
      this.server.emitWarning(error);
    };
    AGServerSocket.prototype._abortAllPendingEventsDueToBadConnection = function(failureType, code, reason) {
      Object.keys(this._callbackMap || {}).forEach((i) => {
        let eventObject = this._callbackMap[i];
        delete this._callbackMap[i];
        clearTimeout(eventObject.timeout);
        delete eventObject.timeout;
        let errorMessage = `Event ${eventObject.event} was aborted due to a bad connection`;
        let badConnectionError = new BadConnectionError(errorMessage, failureType, code, reason);
        let callback = eventObject.callback;
        delete eventObject.callback;
        callback.call(eventObject, badConnectionError, eventObject);
      });
    };
    AGServerSocket.prototype.closeAllMiddlewares = function() {
      this.middlewareHandshakeStream.close();
      this.middlewareInboundRawStream.close();
      this.middlewareInboundStream.close();
      this.middlewareOutboundStream.close();
    };
    AGServerSocket.prototype.closeInput = function() {
      this.inboundMessageStream.close();
    };
    AGServerSocket.prototype.closeOutput = function() {
      this.outboundPacketStream.close();
    };
    AGServerSocket.prototype.closeIO = function() {
      this.closeInput();
      this.closeOutput();
    };
    AGServerSocket.prototype.closeAllStreams = function() {
      this.closeAllMiddlewares();
      this.closeIO();
      this.closeAllReceivers();
      this.closeAllProcedures();
      this.closeAllListeners();
    };
    AGServerSocket.prototype.killAllMiddlewares = function() {
      this.middlewareHandshakeStream.kill();
      this.middlewareInboundRawStream.kill();
      this.middlewareInboundStream.kill();
      this.middlewareOutboundStream.kill();
    };
    AGServerSocket.prototype.killInput = function() {
      this.inboundMessageStream.kill();
    };
    AGServerSocket.prototype.killOutput = function() {
      this.outboundPacketStream.kill();
    };
    AGServerSocket.prototype.killIO = function() {
      this.killInput();
      this.killOutput();
    };
    AGServerSocket.prototype.killAllStreams = function() {
      this.killAllMiddlewares();
      this.killIO();
      this.killAllReceivers();
      this.killAllProcedures();
      this.killAllListeners();
    };
    AGServerSocket.prototype._destroy = async function(code, reason) {
      clearInterval(this._pingIntervalTicker);
      clearTimeout(this._pingTimeoutTicker);
      this._cancelBatching();
      if (this.state === this.CLOSED) {
        this._abortAllPendingEventsDueToBadConnection("connectAbort", code, reason);
      } else {
        if (!reason && AGServerSocket.errorStatuses[code]) {
          reason = AGServerSocket.errorStatuses[code];
        }
        let prevState = this.state;
        this.state = this.CLOSED;
        if (prevState === this.CONNECTING) {
          this._abortAllPendingEventsDueToBadConnection("connectAbort", code, reason);
          this.emit("connectAbort", { code, reason });
          this.server.emit("connectionAbort", {
            socket: this,
            code,
            reason
          });
        } else {
          this._abortAllPendingEventsDueToBadConnection("disconnect", code, reason);
          this.emit("disconnect", { code, reason });
          this.server.emit("disconnection", {
            socket: this,
            code,
            reason
          });
        }
        this.emit("close", { code, reason });
        this.server.emit("closure", {
          socket: this,
          code,
          reason
        });
        clearTimeout(this._handshakeTimeoutRef);
        let isClientFullyConnected = !!this.server.clients[this.id];
        if (isClientFullyConnected) {
          delete this.server.clients[this.id];
          this.server.clientsCount--;
        }
        let isClientPending = !!this.server.pendingClients[this.id];
        if (isClientPending) {
          delete this.server.pendingClients[this.id];
          this.server.pendingClientsCount--;
        }
        if (!AGServerSocket.ignoreStatuses[code]) {
          let closeMessage;
          if (typeof reason === "string") {
            closeMessage = `Socket connection closed with status code ${code} and reason: ${reason}`;
          } else {
            closeMessage = `Socket connection closed with status code ${code}`;
          }
          let err = new SocketProtocolError(AGServerSocket.errorStatuses[code] || closeMessage, code);
          this.emitError(err);
        }
        await this._unsubscribeFromAllChannels();
        let cleanupMode = this.server.options.socketStreamCleanupMode;
        if (cleanupMode === "kill") {
          (async () => {
            await this.listener("end").once();
            this.killAllStreams();
          })();
        } else if (cleanupMode === "close") {
          (async () => {
            await this.listener("end").once();
            this.closeAllStreams();
          })();
        }
        this.emit("end");
      }
    };
    AGServerSocket.prototype.disconnect = async function(code, reason) {
      code = code || 1e3;
      if (typeof code !== "number") {
        let err = new InvalidArgumentsError("If specified, the code argument must be a number");
        this.emitError(err);
      }
      if (this.state !== this.CLOSED) {
        this._destroy(code, reason);
        this.socket.close(code, reason);
      }
    };
    AGServerSocket.prototype.terminate = function() {
      this.socket.terminate();
    };
    AGServerSocket.prototype.send = function(data, options) {
      this.socket.send(data, options, (error) => {
        if (error) {
          this.emitError(error);
          this._destroy(1006, error.toString());
        }
      });
    };
    AGServerSocket.prototype.decode = function(message) {
      return this.server.codec.decode(message);
    };
    AGServerSocket.prototype.encode = function(object) {
      return this.server.codec.encode(object);
    };
    AGServerSocket.prototype.startBatch = function() {
      this.isBufferingBatch = true;
      this._batchBuffer = [];
    };
    AGServerSocket.prototype.flushBatch = function() {
      this.isBufferingBatch = false;
      if (!this._batchBuffer.length) {
        return;
      }
      let serializedBatch = this.serializeObject(this._batchBuffer);
      this._batchBuffer = [];
      this.send(serializedBatch);
    };
    AGServerSocket.prototype.cancelBatch = function() {
      this.isBufferingBatch = false;
      this._batchBuffer = [];
    };
    AGServerSocket.prototype._startBatching = function() {
      if (this._batchingIntervalId != null) {
        return;
      }
      this.startBatch();
      this._batchingIntervalId = setInterval(() => {
        this.flushBatch();
        this.startBatch();
      }, this.batchInterval);
    };
    AGServerSocket.prototype.startBatching = function() {
      this.isBatching = true;
      this._startBatching();
    };
    AGServerSocket.prototype._stopBatching = function() {
      if (this._batchingIntervalId != null) {
        clearInterval(this._batchingIntervalId);
      }
      this._batchingIntervalId = null;
      this.flushBatch();
    };
    AGServerSocket.prototype.stopBatching = function() {
      this.isBatching = false;
      this._stopBatching();
    };
    AGServerSocket.prototype._cancelBatching = function() {
      if (this._batchingIntervalId != null) {
        clearInterval(this._batchingIntervalId);
      }
      this._batchingIntervalId = null;
      this.cancelBatch();
    };
    AGServerSocket.prototype.cancelBatching = function() {
      this.isBatching = false;
      this._cancelBatching();
    };
    AGServerSocket.prototype.serializeObject = function(object) {
      let str;
      try {
        str = this.encode(object);
      } catch (error) {
        this.emitError(error);
        return null;
      }
      return str;
    };
    AGServerSocket.prototype.sendObject = function(object) {
      if (this.isBufferingBatch) {
        this._batchBuffer.push(object);
        return;
      }
      let str = this.serializeObject(object);
      if (str != null) {
        this.send(str);
      }
    };
    AGServerSocket.prototype._handleOutboundPacketStream = async function() {
      for await (let packet of this.outboundPacketStream) {
        if (packet.resolve) {
          (async () => {
            let result;
            try {
              result = await this._invoke(packet.event, packet.data, packet.options);
            } catch (error) {
              packet.reject(error);
              return;
            }
            packet.resolve(result);
          })();
          this.outboundSentMessageCount++;
          continue;
        }
        await this._processTransmit(packet.event, packet.data, packet.options);
        this.outboundSentMessageCount++;
      }
    };
    AGServerSocket.prototype._transmit = async function(event, data, options) {
      if (this.cloneData) {
        data = cloneDeep(data);
      }
      this.outboundPreparedMessageCount++;
      this.outboundPacketStream.write({
        event,
        data,
        options
      });
    };
    AGServerSocket.prototype.transmit = async function(event, data, options) {
      if (this.state !== this.OPEN) {
        let error = new BadConnectionError(
          `Socket transmit ${event} event was aborted due to a bad connection`,
          "connectAbort"
        );
        this.emitError(error);
        return;
      }
      this._transmit(event, data, options);
    };
    AGServerSocket.prototype.invoke = async function(event, data, options) {
      if (this.state !== this.OPEN) {
        let error = new BadConnectionError(
          `Socket invoke ${event} event was aborted due to a bad connection`,
          "connectAbort"
        );
        this.emitError(error);
        throw error;
      }
      if (this.cloneData) {
        data = cloneDeep(data);
      }
      this.outboundPreparedMessageCount++;
      return new Promise((resolve, reject) => {
        this.outboundPacketStream.write({
          event,
          data,
          options,
          resolve,
          reject
        });
      });
    };
    AGServerSocket.prototype._processTransmit = async function(event, data, options) {
      let newData;
      let useCache = options ? options.useCache : false;
      let packet = { event, data };
      let isPublish = event === "#publish";
      if (isPublish) {
        let action = new AGAction();
        action.socket = this;
        action.type = AGAction.PUBLISH_OUT;
        if (data !== void 0) {
          action.channel = data.channel;
          action.data = data.data;
        }
        useCache = !this.server.hasMiddleware(this.middlewareOutboundStream.type);
        try {
          let { data: data2, options: options2 } = await this.server._processMiddlewareAction(this.middlewareOutboundStream, action, this);
          newData = data2;
          useCache = options2 == null ? useCache : options2.useCache;
        } catch (error) {
          return;
        }
      } else {
        newData = packet.data;
      }
      if (options && useCache && options.stringifiedData != null && !this.isBufferingBatch) {
        this.send(options.stringifiedData);
      } else {
        let eventObject = {
          event
        };
        if (isPublish) {
          eventObject.data = data || {};
          eventObject.data.data = newData;
        } else {
          eventObject.data = newData;
        }
        this.sendObject(eventObject);
      }
    };
    AGServerSocket.prototype._invoke = async function(event, data, options) {
      options = options || {};
      return new Promise((resolve, reject) => {
        let eventObject = {
          event,
          cid: this._nextCallId()
        };
        if (data !== void 0) {
          eventObject.data = data;
        }
        let ackTimeout = options.ackTimeout == null ? this.server.ackTimeout : options.ackTimeout;
        let timeout = setTimeout(() => {
          let error = new TimeoutError(`Event response for ${event} event timed out`);
          delete this._callbackMap[eventObject.cid];
          reject(error);
        }, ackTimeout);
        this._callbackMap[eventObject.cid] = {
          event,
          callback: (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(result);
          },
          timeout
        };
        if (options.useCache && options.stringifiedData != null && !this.isBufferingBatch) {
          this.send(options.stringifiedData);
        } else {
          this.sendObject(eventObject);
        }
      });
    };
    AGServerSocket.prototype.triggerAuthenticationEvents = function(oldAuthState) {
      if (oldAuthState !== this.AUTHENTICATED) {
        let stateChangeData = {
          oldAuthState,
          newAuthState: this.authState,
          authToken: this.authToken
        };
        this.emit("authStateChange", stateChangeData);
        this.server.emit("authenticationStateChange", {
          socket: this,
          ...stateChangeData
        });
      }
      this.emit("authenticate", { authToken: this.authToken });
      this.server.emit("authentication", {
        socket: this,
        authToken: this.authToken
      });
    };
    AGServerSocket.prototype.setAuthToken = async function(data, options) {
      if (this.state === this.CONNECTING) {
        let err = new InvalidActionError(
          "Cannot call setAuthToken before completing the handshake"
        );
        this.emitError(err);
        throw err;
      }
      let authToken = cloneDeep(data);
      let oldAuthState = this.authState;
      this.authState = this.AUTHENTICATED;
      if (options == null) {
        options = {};
      } else {
        options = { ...options };
        if (options.algorithm != null) {
          delete options.algorithm;
          let err = new InvalidArgumentsError(
            "Cannot change auth token algorithm at runtime - It must be specified as a config option on launch"
          );
          this.emitError(err);
        }
      }
      options.mutatePayload = true;
      let rejectOnFailedDelivery = options.rejectOnFailedDelivery;
      delete options.rejectOnFailedDelivery;
      let defaultSignatureOptions = this.server.defaultSignatureOptions;
      let expiresIn;
      if (options.expiresIn == null) {
        expiresIn = defaultSignatureOptions.expiresIn;
      } else {
        expiresIn = options.expiresIn;
      }
      if (authToken) {
        if (authToken.exp == null) {
          options.expiresIn = expiresIn;
        } else {
          delete options.expiresIn;
        }
      } else {
        options.expiresIn = expiresIn;
      }
      if (defaultSignatureOptions.algorithm != null) {
        options.algorithm = defaultSignatureOptions.algorithm;
      }
      this.authToken = authToken;
      let signedAuthToken;
      try {
        signedAuthToken = await this.server.auth.signToken(authToken, this.server.signatureKey, options);
      } catch (error) {
        this.emitError(error);
        this._destroy(4002, error.toString());
        this.socket.close(4002);
        throw error;
      }
      if (this.authToken === authToken) {
        this.signedAuthToken = signedAuthToken;
        this.emit("authTokenSigned", { signedAuthToken });
      }
      this.triggerAuthenticationEvents(oldAuthState);
      let tokenData = {
        token: signedAuthToken
      };
      if (rejectOnFailedDelivery) {
        try {
          await this.invoke("#setAuthToken", tokenData);
        } catch (err) {
          let error;
          if (err && typeof err.message === "string") {
            error = new AuthError(`Failed to deliver auth token to client - ${err.message}`);
          } else {
            error = new AuthError(
              "Failed to confirm delivery of auth token to client due to malformatted error response"
            );
          }
          this.emitError(error);
          throw error;
        }
        return;
      }
      this.transmit("#setAuthToken", tokenData);
    };
    AGServerSocket.prototype.getAuthToken = function() {
      return this.authToken;
    };
    AGServerSocket.prototype.deauthenticateSelf = function() {
      let oldAuthState = this.authState;
      let oldAuthToken = this.authToken;
      this.signedAuthToken = null;
      this.authToken = null;
      this.authState = this.UNAUTHENTICATED;
      if (oldAuthState !== this.UNAUTHENTICATED) {
        let stateChangeData = {
          oldAuthState,
          newAuthState: this.authState
        };
        this.emit("authStateChange", stateChangeData);
        this.server.emit("authenticationStateChange", {
          socket: this,
          ...stateChangeData
        });
      }
      this.emit("deauthenticate", { oldAuthToken });
      this.server.emit("deauthentication", {
        socket: this,
        oldAuthToken
      });
    };
    AGServerSocket.prototype.deauthenticate = async function(options) {
      this.deauthenticateSelf();
      if (options && options.rejectOnFailedDelivery) {
        try {
          await this.invoke("#removeAuthToken");
        } catch (error) {
          this.emitError(error);
          if (options && options.rejectOnFailedDelivery) {
            throw error;
          }
        }
        return;
      }
      this._transmit("#removeAuthToken");
    };
    AGServerSocket.prototype.kickOut = function(channel, message) {
      let channels = channel;
      if (!channels) {
        channels = Object.keys(this.channelSubscriptions);
      }
      if (!Array.isArray(channels)) {
        channels = [channel];
      }
      return Promise.all(channels.map((channelName) => {
        this.transmit("#kickOut", { channel: channelName, message });
        return this._unsubscribe(channelName);
      }));
    };
    AGServerSocket.prototype.subscriptions = function() {
      return Object.keys(this.channelSubscriptions);
    };
    AGServerSocket.prototype.isSubscribed = function(channel) {
      return !!this.channelSubscriptions[channel];
    };
    AGServerSocket.prototype._processAuthTokenExpiry = function() {
      let token = this.getAuthToken();
      if (this.isAuthTokenExpired(token)) {
        this.deauthenticate();
        return new AuthTokenExpiredError(
          "The socket auth token has expired",
          token.exp
        );
      }
      return null;
    };
    AGServerSocket.prototype.isAuthTokenExpired = function(token) {
      if (token && token.exp != null) {
        let currentTime = Date.now();
        let expiryMilliseconds = token.exp * 1e3;
        return currentTime > expiryMilliseconds;
      }
      return false;
    };
    AGServerSocket.prototype._processTokenError = function(err) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          let authError2 = new AuthTokenExpiredError(err.message, err.expiredAt);
          authError2.isBadToken = true;
          return authError2;
        }
        if (err.name === "JsonWebTokenError") {
          let authError2 = new AuthTokenInvalidError(err.message);
          authError2.isBadToken = true;
          return authError2;
        }
        if (err.name === "NotBeforeError") {
          let authError2 = new AuthTokenNotBeforeError(err.message, err.date);
          authError2.isBadToken = false;
          return authError2;
        }
        let authError = new AuthTokenError(err.message);
        authError.isBadToken = true;
        return authError;
      }
      return null;
    };
    AGServerSocket.prototype._emitBadAuthTokenError = function(error, signedAuthToken) {
      this.emit("badAuthToken", {
        authError: error,
        signedAuthToken
      });
      this.server.emit("badSocketAuthToken", {
        socket: this,
        authError: error,
        signedAuthToken
      });
    };
    AGServerSocket.prototype._validateAuthToken = async function(signedAuthToken) {
      let verificationOptions = Object.assign({}, this.server.defaultVerificationOptions, {
        socket: this
      });
      let authToken;
      try {
        authToken = await this.server.auth.verifyToken(signedAuthToken, this.server.verificationKey, verificationOptions);
      } catch (error) {
        let authTokenError = this._processTokenError(error);
        return {
          signedAuthToken,
          authTokenError,
          authToken: null,
          authState: this.UNAUTHENTICATED
        };
      }
      return {
        signedAuthToken,
        authTokenError: null,
        authToken,
        authState: this.AUTHENTICATED
      };
    };
    AGServerSocket.prototype._processAuthentication = async function({ signedAuthToken, authTokenError, authToken, authState }) {
      if (authTokenError) {
        this.signedAuthToken = null;
        this.authToken = null;
        this.authState = this.UNAUTHENTICATED;
        if (signedAuthToken != null) {
          this.emitError(authTokenError);
          if (authTokenError.isBadToken) {
            this._emitBadAuthTokenError(authTokenError, signedAuthToken);
          }
        }
        throw authTokenError;
      }
      this.signedAuthToken = signedAuthToken;
      this.authToken = authToken;
      this.authState = this.AUTHENTICATED;
      let action = new AGAction();
      action.socket = this;
      action.type = AGAction.AUTHENTICATE;
      action.signedAuthToken = this.signedAuthToken;
      action.authToken = this.authToken;
      try {
        await this.server._processMiddlewareAction(this.middlewareInboundStream, action, this);
      } catch (error) {
        this.authToken = null;
        this.authState = this.UNAUTHENTICATED;
        if (error.isBadToken) {
          this._emitBadAuthTokenError(error, signedAuthToken);
        }
        throw error;
      }
    };
    module2.exports = AGServerSocket;
  }
});

// ../../node_modules/.pnpm/safe-buffer@5.2.1/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "../../node_modules/.pnpm/safe-buffer@5.2.1/node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// ../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/lib/data-stream.js
var require_data_stream = __commonJS({
  "../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/lib/data-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var Stream = require("stream");
    var util = require("util");
    function DataStream(data) {
      this.buffer = null;
      this.writable = true;
      this.readable = true;
      if (!data) {
        this.buffer = Buffer2.alloc(0);
        return this;
      }
      if (typeof data.pipe === "function") {
        this.buffer = Buffer2.alloc(0);
        data.pipe(this);
        return this;
      }
      if (data.length || typeof data === "object") {
        this.buffer = data;
        this.writable = false;
        process.nextTick(function() {
          this.emit("end", data);
          this.readable = false;
          this.emit("close");
        }.bind(this));
        return this;
      }
      throw new TypeError("Unexpected data type (" + typeof data + ")");
    }
    util.inherits(DataStream, Stream);
    DataStream.prototype.write = function write(data) {
      this.buffer = Buffer2.concat([this.buffer, Buffer2.from(data)]);
      this.emit("data", data);
    };
    DataStream.prototype.end = function end(data) {
      if (data)
        this.write(data);
      this.emit("end", data);
      this.emit("close");
      this.writable = false;
      this.readable = false;
    };
    module2.exports = DataStream;
  }
});

// ../../node_modules/.pnpm/ecdsa-sig-formatter@1.0.11/node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js
var require_param_bytes_for_alg = __commonJS({
  "../../node_modules/.pnpm/ecdsa-sig-formatter@1.0.11/node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js"(exports2, module2) {
    "use strict";
    function getParamSize(keySize) {
      var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
      return result;
    }
    var paramBytesForAlg = {
      ES256: getParamSize(256),
      ES384: getParamSize(384),
      ES512: getParamSize(521)
    };
    function getParamBytesForAlg(alg) {
      var paramBytes = paramBytesForAlg[alg];
      if (paramBytes) {
        return paramBytes;
      }
      throw new Error('Unknown algorithm "' + alg + '"');
    }
    module2.exports = getParamBytesForAlg;
  }
});

// ../../node_modules/.pnpm/ecdsa-sig-formatter@1.0.11/node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js
var require_ecdsa_sig_formatter = __commonJS({
  "../../node_modules/.pnpm/ecdsa-sig-formatter@1.0.11/node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js"(exports2, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var getParamBytesForAlg = require_param_bytes_for_alg();
    var MAX_OCTET = 128;
    var CLASS_UNIVERSAL = 0;
    var PRIMITIVE_BIT = 32;
    var TAG_SEQ = 16;
    var TAG_INT = 2;
    var ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6;
    var ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
    function base64Url(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function signatureAsBuffer(signature) {
      if (Buffer2.isBuffer(signature)) {
        return signature;
      } else if ("string" === typeof signature) {
        return Buffer2.from(signature, "base64");
      }
      throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
    }
    function derToJose(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var maxEncodedParamLength = paramBytes + 1;
      var inputLength = signature.length;
      var offset = 0;
      if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
      }
      var seqLength = signature[offset++];
      if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
      }
      if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
      }
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
      }
      var rLength = signature[offset++];
      if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
      }
      if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var rOffset = offset;
      offset += rLength;
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
      }
      var sLength = signature[offset++];
      if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
      }
      if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var sOffset = offset;
      offset += sLength;
      if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
      }
      var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
      var dst = Buffer2.allocUnsafe(rPadding + rLength + sPadding + sLength);
      for (offset = 0; offset < rPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
      offset = paramBytes;
      for (var o = offset; offset < o + sPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
      dst = dst.toString("base64");
      dst = base64Url(dst);
      return dst;
    }
    function countPadding(buf, start, stop) {
      var padding = 0;
      while (start + padding < stop && buf[start + padding] === 0) {
        ++padding;
      }
      var needsSign = buf[start + padding] >= MAX_OCTET;
      if (needsSign) {
        --padding;
      }
      return padding;
    }
    function joseToDer(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var signatureBytes = signature.length;
      if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
      }
      var rPadding = countPadding(signature, 0, paramBytes);
      var sPadding = countPadding(signature, paramBytes, signature.length);
      var rLength = paramBytes - rPadding;
      var sLength = paramBytes - sPadding;
      var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
      var shortLength = rsBytes < MAX_OCTET;
      var dst = Buffer2.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
      var offset = 0;
      dst[offset++] = ENCODED_TAG_SEQ;
      if (shortLength) {
        dst[offset++] = rsBytes;
      } else {
        dst[offset++] = MAX_OCTET | 1;
        dst[offset++] = rsBytes & 255;
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = rLength;
      if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
      } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = sLength;
      if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
      } else {
        signature.copy(dst, offset, paramBytes + sPadding);
      }
      return dst;
    }
    module2.exports = {
      derToJose,
      joseToDer
    };
  }
});

// ../../node_modules/.pnpm/buffer-equal-constant-time@1.0.1/node_modules/buffer-equal-constant-time/index.js
var require_buffer_equal_constant_time = __commonJS({
  "../../node_modules/.pnpm/buffer-equal-constant-time@1.0.1/node_modules/buffer-equal-constant-time/index.js"(exports2, module2) {
    "use strict";
    var Buffer2 = require("buffer").Buffer;
    var SlowBuffer = require("buffer").SlowBuffer;
    module2.exports = bufferEq;
    function bufferEq(a, b) {
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      var c = 0;
      for (var i = 0; i < a.length; i++) {
        c |= a[i] ^ b[i];
      }
      return c === 0;
    }
    bufferEq.install = function() {
      Buffer2.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
        return bufferEq(this, that);
      };
    };
    var origBufEqual = Buffer2.prototype.equal;
    var origSlowBufEqual = SlowBuffer.prototype.equal;
    bufferEq.restore = function() {
      Buffer2.prototype.equal = origBufEqual;
      SlowBuffer.prototype.equal = origSlowBufEqual;
    };
  }
});

// ../../node_modules/.pnpm/jwa@2.0.1/node_modules/jwa/index.js
var require_jwa = __commonJS({
  "../../node_modules/.pnpm/jwa@2.0.1/node_modules/jwa/index.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto = require("crypto");
    var formatEcdsa = require_ecdsa_sig_formatter();
    var util = require("util");
    var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
    var MSG_INVALID_SECRET = "secret must be a string or buffer";
    var MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer";
    var MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object";
    var supportsKeyObjects = typeof crypto.createPublicKey === "function";
    if (supportsKeyObjects) {
      MSG_INVALID_VERIFIER_KEY += " or a KeyObject";
      MSG_INVALID_SECRET += "or a KeyObject";
    }
    function checkIsPublicKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return;
      }
      if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key !== "object") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.type !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.asymmetricKeyType !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
    }
    function checkIsPrivateKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return;
      }
      if (typeof key === "object") {
        return;
      }
      throw typeError(MSG_INVALID_SIGNER_KEY);
    }
    function checkIsSecretKey(key) {
      if (Buffer2.isBuffer(key)) {
        return;
      }
      if (typeof key === "string") {
        return key;
      }
      if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (typeof key !== "object") {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (key.type !== "secret") {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (typeof key.export !== "function") {
        throw typeError(MSG_INVALID_SECRET);
      }
    }
    function fromBase64(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function toBase64(base64url) {
      base64url = base64url.toString();
      var padding = 4 - base64url.length % 4;
      if (padding !== 4) {
        for (var i = 0; i < padding; ++i) {
          base64url += "=";
        }
      }
      return base64url.replace(/\-/g, "+").replace(/_/g, "/");
    }
    function typeError(template) {
      var args = [].slice.call(arguments, 1);
      var errMsg = util.format.bind(util, template).apply(null, args);
      return new TypeError(errMsg);
    }
    function bufferOrString(obj) {
      return Buffer2.isBuffer(obj) || typeof obj === "string";
    }
    function normalizeInput(thing) {
      if (!bufferOrString(thing))
        thing = JSON.stringify(thing);
      return thing;
    }
    function createHmacSigner(bits) {
      return function sign(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto.createHmac("sha" + bits, secret);
        var sig = (hmac.update(thing), hmac.digest("base64"));
        return fromBase64(sig);
      };
    }
    var bufferEqual;
    var timingSafeEqual = "timingSafeEqual" in crypto ? function timingSafeEqual2(a, b) {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      return crypto.timingSafeEqual(a, b);
    } : function timingSafeEqual2(a, b) {
      if (!bufferEqual) {
        bufferEqual = require_buffer_equal_constant_time();
      }
      return bufferEqual(a, b);
    };
    function createHmacVerifier(bits) {
      return function verify(thing, signature, secret) {
        var computedSig = createHmacSigner(bits)(thing, secret);
        return timingSafeEqual(Buffer2.from(signature), Buffer2.from(computedSig));
      };
    }
    function createKeySigner(bits) {
      return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, "base64"));
        return fromBase64(sig);
      };
    }
    function createKeyVerifier(bits) {
      return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, "base64");
      };
    }
    function createPSSKeySigner(bits) {
      return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign({
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
        return fromBase64(sig);
      };
    }
    function createPSSKeyVerifier(bits) {
      return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify({
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, "base64");
      };
    }
    function createECDSASigner(bits) {
      var inner = createKeySigner(bits);
      return function sign() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, "ES" + bits);
        return signature;
      };
    }
    function createECDSAVerifer(bits) {
      var inner = createKeyVerifier(bits);
      return function verify(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, "ES" + bits).toString("base64");
        var result = inner(thing, signature, publicKey);
        return result;
      };
    }
    function createNoneSigner() {
      return function sign() {
        return "";
      };
    }
    function createNoneVerifier() {
      return function verify(thing, signature) {
        return signature === "";
      };
    }
    module2.exports = function jwa(algorithm) {
      var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
      };
      var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
      };
      var match = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
      if (!match)
        throw typeError(MSG_INVALID_ALGORITHM, algorithm);
      var algo = (match[1] || match[3]).toLowerCase();
      var bits = match[2];
      return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
      };
    };
  }
});

// ../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/lib/tostring.js
var require_tostring = __commonJS({
  "../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/lib/tostring.js"(exports2, module2) {
    var Buffer2 = require("buffer").Buffer;
    module2.exports = function toString(obj) {
      if (typeof obj === "string")
        return obj;
      if (typeof obj === "number" || Buffer2.isBuffer(obj))
        return obj.toString();
      return JSON.stringify(obj);
    };
  }
});

// ../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/lib/sign-stream.js
var require_sign_stream = __commonJS({
  "../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/lib/sign-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var DataStream = require_data_stream();
    var jwa = require_jwa();
    var Stream = require("stream");
    var toString = require_tostring();
    var util = require("util");
    function base64url(string, encoding) {
      return Buffer2.from(string, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function jwsSecuredInput(header, payload, encoding) {
      encoding = encoding || "utf8";
      var encodedHeader = base64url(toString(header), "binary");
      var encodedPayload = base64url(toString(payload), encoding);
      return util.format("%s.%s", encodedHeader, encodedPayload);
    }
    function jwsSign(opts) {
      var header = opts.header;
      var payload = opts.payload;
      var secretOrKey = opts.secret || opts.privateKey;
      var encoding = opts.encoding;
      var algo = jwa(header.alg);
      var securedInput = jwsSecuredInput(header, payload, encoding);
      var signature = algo.sign(securedInput, secretOrKey);
      return util.format("%s.%s", securedInput, signature);
    }
    function SignStream(opts) {
      var secret = opts.secret;
      secret = secret == null ? opts.privateKey : secret;
      secret = secret == null ? opts.key : secret;
      if (/^hs/i.test(opts.header.alg) === true && secret == null) {
        throw new TypeError("secret must be a string or buffer or a KeyObject");
      }
      var secretStream = new DataStream(secret);
      this.readable = true;
      this.header = opts.header;
      this.encoding = opts.encoding;
      this.secret = this.privateKey = this.key = secretStream;
      this.payload = new DataStream(opts.payload);
      this.secret.once("close", function() {
        if (!this.payload.writable && this.readable)
          this.sign();
      }.bind(this));
      this.payload.once("close", function() {
        if (!this.secret.writable && this.readable)
          this.sign();
      }.bind(this));
    }
    util.inherits(SignStream, Stream);
    SignStream.prototype.sign = function sign() {
      try {
        var signature = jwsSign({
          header: this.header,
          payload: this.payload.buffer,
          secret: this.secret.buffer,
          encoding: this.encoding
        });
        this.emit("done", signature);
        this.emit("data", signature);
        this.emit("end");
        this.readable = false;
        return signature;
      } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
      }
    };
    SignStream.sign = jwsSign;
    module2.exports = SignStream;
  }
});

// ../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/lib/verify-stream.js
var require_verify_stream = __commonJS({
  "../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/lib/verify-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var DataStream = require_data_stream();
    var jwa = require_jwa();
    var Stream = require("stream");
    var toString = require_tostring();
    var util = require("util");
    var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
    function isObject(thing) {
      return Object.prototype.toString.call(thing) === "[object Object]";
    }
    function safeJsonParse(thing) {
      if (isObject(thing))
        return thing;
      try {
        return JSON.parse(thing);
      } catch (e) {
        return void 0;
      }
    }
    function headerFromJWS(jwsSig) {
      var encodedHeader = jwsSig.split(".", 1)[0];
      return safeJsonParse(Buffer2.from(encodedHeader, "base64").toString("binary"));
    }
    function securedInputFromJWS(jwsSig) {
      return jwsSig.split(".", 2).join(".");
    }
    function signatureFromJWS(jwsSig) {
      return jwsSig.split(".")[2];
    }
    function payloadFromJWS(jwsSig, encoding) {
      encoding = encoding || "utf8";
      var payload = jwsSig.split(".")[1];
      return Buffer2.from(payload, "base64").toString(encoding);
    }
    function isValidJws(string) {
      return JWS_REGEX.test(string) && !!headerFromJWS(string);
    }
    function jwsVerify(jwsSig, algorithm, secretOrKey) {
      if (!algorithm) {
        var err = new Error("Missing algorithm parameter for jws.verify");
        err.code = "MISSING_ALGORITHM";
        throw err;
      }
      jwsSig = toString(jwsSig);
      var signature = signatureFromJWS(jwsSig);
      var securedInput = securedInputFromJWS(jwsSig);
      var algo = jwa(algorithm);
      return algo.verify(securedInput, signature, secretOrKey);
    }
    function jwsDecode(jwsSig, opts) {
      opts = opts || {};
      jwsSig = toString(jwsSig);
      if (!isValidJws(jwsSig))
        return null;
      var header = headerFromJWS(jwsSig);
      if (!header)
        return null;
      var payload = payloadFromJWS(jwsSig);
      if (header.typ === "JWT" || opts.json)
        payload = JSON.parse(payload, opts.encoding);
      return {
        header,
        payload,
        signature: signatureFromJWS(jwsSig)
      };
    }
    function VerifyStream(opts) {
      opts = opts || {};
      var secretOrKey = opts.secret;
      secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey;
      secretOrKey = secretOrKey == null ? opts.key : secretOrKey;
      if (/^hs/i.test(opts.algorithm) === true && secretOrKey == null) {
        throw new TypeError("secret must be a string or buffer or a KeyObject");
      }
      var secretStream = new DataStream(secretOrKey);
      this.readable = true;
      this.algorithm = opts.algorithm;
      this.encoding = opts.encoding;
      this.secret = this.publicKey = this.key = secretStream;
      this.signature = new DataStream(opts.signature);
      this.secret.once("close", function() {
        if (!this.signature.writable && this.readable)
          this.verify();
      }.bind(this));
      this.signature.once("close", function() {
        if (!this.secret.writable && this.readable)
          this.verify();
      }.bind(this));
    }
    util.inherits(VerifyStream, Stream);
    VerifyStream.prototype.verify = function verify() {
      try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit("done", valid, obj);
        this.emit("data", valid);
        this.emit("end");
        this.readable = false;
        return valid;
      } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
      }
    };
    VerifyStream.decode = jwsDecode;
    VerifyStream.isValid = isValidJws;
    VerifyStream.verify = jwsVerify;
    module2.exports = VerifyStream;
  }
});

// ../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/index.js
var require_jws = __commonJS({
  "../../node_modules/.pnpm/jws@4.0.1/node_modules/jws/index.js"(exports2) {
    var SignStream = require_sign_stream();
    var VerifyStream = require_verify_stream();
    var ALGORITHMS = [
      "HS256",
      "HS384",
      "HS512",
      "RS256",
      "RS384",
      "RS512",
      "PS256",
      "PS384",
      "PS512",
      "ES256",
      "ES384",
      "ES512"
    ];
    exports2.ALGORITHMS = ALGORITHMS;
    exports2.sign = SignStream.sign;
    exports2.verify = VerifyStream.verify;
    exports2.decode = VerifyStream.decode;
    exports2.isValid = VerifyStream.isValid;
    exports2.createSign = function createSign(opts) {
      return new SignStream(opts);
    };
    exports2.createVerify = function createVerify(opts) {
      return new VerifyStream(opts);
    };
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/decode.js
var require_decode = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/decode.js"(exports2, module2) {
    var jws = require_jws();
    module2.exports = function(jwt, options) {
      options = options || {};
      var decoded = jws.decode(jwt, options);
      if (!decoded) {
        return null;
      }
      var payload = decoded.payload;
      if (typeof payload === "string") {
        try {
          var obj = JSON.parse(payload);
          if (obj !== null && typeof obj === "object") {
            payload = obj;
          }
        } catch (e) {
        }
      }
      if (options.complete === true) {
        return {
          header: decoded.header,
          payload,
          signature: decoded.signature
        };
      }
      return payload;
    };
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/JsonWebTokenError.js
var require_JsonWebTokenError = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/JsonWebTokenError.js"(exports2, module2) {
    var JsonWebTokenError = function(message, error) {
      Error.call(this, message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = "JsonWebTokenError";
      this.message = message;
      if (error) this.inner = error;
    };
    JsonWebTokenError.prototype = Object.create(Error.prototype);
    JsonWebTokenError.prototype.constructor = JsonWebTokenError;
    module2.exports = JsonWebTokenError;
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/NotBeforeError.js
var require_NotBeforeError = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/NotBeforeError.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var NotBeforeError = function(message, date) {
      JsonWebTokenError.call(this, message);
      this.name = "NotBeforeError";
      this.date = date;
    };
    NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
    NotBeforeError.prototype.constructor = NotBeforeError;
    module2.exports = NotBeforeError;
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/TokenExpiredError.js
var require_TokenExpiredError = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/TokenExpiredError.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var TokenExpiredError = function(message, expiredAt) {
      JsonWebTokenError.call(this, message);
      this.name = "TokenExpiredError";
      this.expiredAt = expiredAt;
    };
    TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
    TokenExpiredError.prototype.constructor = TokenExpiredError;
    module2.exports = TokenExpiredError;
  }
});

// ../../node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js
var require_ms = __commonJS({
  "../../node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/timespan.js
var require_timespan = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/timespan.js"(exports2, module2) {
    var ms = require_ms();
    module2.exports = function(time, iat) {
      var timestamp = iat || Math.floor(Date.now() / 1e3);
      if (typeof time === "string") {
        var milliseconds = ms(time);
        if (typeof milliseconds === "undefined") {
          return;
        }
        return Math.floor(timestamp + milliseconds / 1e3);
      } else if (typeof time === "number") {
        return timestamp + time;
      } else {
        return;
      }
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/constants.js"(exports2, module2) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module2.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/debug.js"(exports2, module2) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/re.js
var require_re = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/re.js"(exports2, module2) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = exports2.re = [];
    var safeRe = exports2.safeRe = [];
    var src = exports2.src = [];
    var safeSrc = exports2.safeSrc = [];
    var t = exports2.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/parse-options.js"(exports2, module2) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module2.exports = parseOptions;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/identifiers.js"(exports2, module2) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/semver.js"(exports2, module2) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/parse.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module2.exports = parse;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/valid.js"(exports2, module2) {
    "use strict";
    var parse = require_parse();
    var valid = (version, options) => {
      const v = parse(version, options);
      return v ? v.version : null;
    };
    module2.exports = valid;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/clean.js"(exports2, module2) {
    "use strict";
    var parse = require_parse();
    var clean = (version, options) => {
      const s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module2.exports = clean;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/inc.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module2.exports = inc;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/diff.js"(exports2, module2) {
    "use strict";
    var parse = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse(version1, null, true);
      const v2 = parse(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module2.exports = diff;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/major.js
var require_major = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/major.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module2.exports = major;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/minor.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module2.exports = minor;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/patch.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module2.exports = patch;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/prerelease.js"(exports2, module2) {
    "use strict";
    var parse = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module2.exports = prerelease;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rcompare.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module2.exports = rcompare;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-loose.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module2.exports = compareLoose;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-build.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module2.exports = compareBuild;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/sort.js"(exports2, module2) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module2.exports = sort;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rsort.js"(exports2, module2) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module2.exports = rsort;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module2.exports = gt;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module2.exports = lt;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/eq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module2.exports = eq;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/neq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module2.exports = neq;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module2.exports = gte;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module2.exports = lte;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/cmp.js"(exports2, module2) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module2.exports = cmp;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/coerce.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module2.exports = coerce;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/lrucache.js"(exports2, module2) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module2.exports = LRUCache;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/range.js
var require_range = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/range.js"(exports2, module2) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/comparator.js"(exports2, module2) {
    "use strict";
    var ANY = Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module2.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/satisfies.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module2.exports = satisfies;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/to-comparators.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module2.exports = toComparators;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/max-satisfying.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module2.exports = maxSatisfying;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-satisfying.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module2.exports = minSatisfying;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-version.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module2.exports = minVersion;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/valid.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module2.exports = validRange;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/outside.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module2.exports = outside;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/gtr.js"(exports2, module2) {
    "use strict";
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module2.exports = gtr;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/ltr.js"(exports2, module2) {
    "use strict";
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module2.exports = ltr;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/intersects.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module2.exports = intersects;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/simplify.js"(exports2, module2) {
    "use strict";
    var satisfies = require_satisfies();
    var compare = require_compare();
    module2.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/subset.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module2.exports = subset;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/index.js
var require_semver2 = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/index.js"(exports2, module2) {
    "use strict";
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module2.exports = {
      parse,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js
var require_asymmetricKeyDetailsSupported = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, ">=15.7.0");
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js
var require_rsaPssKeyDetailsSupported = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, ">=16.9.0");
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js
var require_validateAsymmetricKey = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/validateAsymmetricKey.js"(exports2, module2) {
    var ASYMMETRIC_KEY_DETAILS_SUPPORTED = require_asymmetricKeyDetailsSupported();
    var RSA_PSS_KEY_DETAILS_SUPPORTED = require_rsaPssKeyDetailsSupported();
    var allowedAlgorithmsForKeys = {
      "ec": ["ES256", "ES384", "ES512"],
      "rsa": ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
      "rsa-pss": ["PS256", "PS384", "PS512"]
    };
    var allowedCurves = {
      ES256: "prime256v1",
      ES384: "secp384r1",
      ES512: "secp521r1"
    };
    module2.exports = function(algorithm, key) {
      if (!algorithm || !key) return;
      const keyType = key.asymmetricKeyType;
      if (!keyType) return;
      const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
      if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
      }
      if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(", ")}.`);
      }
      if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch (keyType) {
          case "ec":
            const keyCurve = key.asymmetricKeyDetails.namedCurve;
            const allowedCurve = allowedCurves[algorithm];
            if (keyCurve !== allowedCurve) {
              throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
            }
            break;
          case "rsa-pss":
            if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
              const length = parseInt(algorithm.slice(-3), 10);
              const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
              if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
              }
              if (saltLength !== void 0 && saltLength > length >> 3) {
                throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
              }
            }
            break;
        }
      }
    };
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/psSupported.js
var require_psSupported = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/lib/psSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, "^6.12.0 || >=8.0.0");
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/verify.js
var require_verify = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/verify.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var NotBeforeError = require_NotBeforeError();
    var TokenExpiredError = require_TokenExpiredError();
    var decode = require_decode();
    var timespan = require_timespan();
    var validateAsymmetricKey = require_validateAsymmetricKey();
    var PS_SUPPORTED = require_psSupported();
    var jws = require_jws();
    var { KeyObject, createSecretKey, createPublicKey } = require("crypto");
    var PUB_KEY_ALGS = ["RS256", "RS384", "RS512"];
    var EC_KEY_ALGS = ["ES256", "ES384", "ES512"];
    var RSA_KEY_ALGS = ["RS256", "RS384", "RS512"];
    var HS_ALGS = ["HS256", "HS384", "HS512"];
    if (PS_SUPPORTED) {
      PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
      RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
    }
    module2.exports = function(jwtString, secretOrPublicKey, options, callback) {
      if (typeof options === "function" && !callback) {
        callback = options;
        options = {};
      }
      if (!options) {
        options = {};
      }
      options = Object.assign({}, options);
      let done;
      if (callback) {
        done = callback;
      } else {
        done = function(err, data) {
          if (err) throw err;
          return data;
        };
      }
      if (options.clockTimestamp && typeof options.clockTimestamp !== "number") {
        return done(new JsonWebTokenError("clockTimestamp must be a number"));
      }
      if (options.nonce !== void 0 && (typeof options.nonce !== "string" || options.nonce.trim() === "")) {
        return done(new JsonWebTokenError("nonce must be a non-empty string"));
      }
      if (options.allowInvalidAsymmetricKeyTypes !== void 0 && typeof options.allowInvalidAsymmetricKeyTypes !== "boolean") {
        return done(new JsonWebTokenError("allowInvalidAsymmetricKeyTypes must be a boolean"));
      }
      const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1e3);
      if (!jwtString) {
        return done(new JsonWebTokenError("jwt must be provided"));
      }
      if (typeof jwtString !== "string") {
        return done(new JsonWebTokenError("jwt must be a string"));
      }
      const parts = jwtString.split(".");
      if (parts.length !== 3) {
        return done(new JsonWebTokenError("jwt malformed"));
      }
      let decodedToken;
      try {
        decodedToken = decode(jwtString, { complete: true });
      } catch (err) {
        return done(err);
      }
      if (!decodedToken) {
        return done(new JsonWebTokenError("invalid token"));
      }
      const header = decodedToken.header;
      let getSecret;
      if (typeof secretOrPublicKey === "function") {
        if (!callback) {
          return done(new JsonWebTokenError("verify must be called asynchronous if secret or public key is provided as a callback"));
        }
        getSecret = secretOrPublicKey;
      } else {
        getSecret = function(header2, secretCallback) {
          return secretCallback(null, secretOrPublicKey);
        };
      }
      return getSecret(header, function(err, secretOrPublicKey2) {
        if (err) {
          return done(new JsonWebTokenError("error in secret or public key callback: " + err.message));
        }
        const hasSignature = parts[2].trim() !== "";
        if (!hasSignature && secretOrPublicKey2) {
          return done(new JsonWebTokenError("jwt signature is required"));
        }
        if (hasSignature && !secretOrPublicKey2) {
          return done(new JsonWebTokenError("secret or public key must be provided"));
        }
        if (!hasSignature && !options.algorithms) {
          return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey2 != null && !(secretOrPublicKey2 instanceof KeyObject)) {
          try {
            secretOrPublicKey2 = createPublicKey(secretOrPublicKey2);
          } catch (_) {
            try {
              secretOrPublicKey2 = createSecretKey(typeof secretOrPublicKey2 === "string" ? Buffer.from(secretOrPublicKey2) : secretOrPublicKey2);
            } catch (_2) {
              return done(new JsonWebTokenError("secretOrPublicKey is not valid key material"));
            }
          }
        }
        if (!options.algorithms) {
          if (secretOrPublicKey2.type === "secret") {
            options.algorithms = HS_ALGS;
          } else if (["rsa", "rsa-pss"].includes(secretOrPublicKey2.asymmetricKeyType)) {
            options.algorithms = RSA_KEY_ALGS;
          } else if (secretOrPublicKey2.asymmetricKeyType === "ec") {
            options.algorithms = EC_KEY_ALGS;
          } else {
            options.algorithms = PUB_KEY_ALGS;
          }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
          return done(new JsonWebTokenError("invalid algorithm"));
        }
        if (header.alg.startsWith("HS") && secretOrPublicKey2.type !== "secret") {
          return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey2.type !== "public") {
          return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
          try {
            validateAsymmetricKey(header.alg, secretOrPublicKey2);
          } catch (e) {
            return done(e);
          }
        }
        let valid;
        try {
          valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey2);
        } catch (e) {
          return done(e);
        }
        if (!valid) {
          return done(new JsonWebTokenError("invalid signature"));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== "undefined" && !options.ignoreNotBefore) {
          if (typeof payload.nbf !== "number") {
            return done(new JsonWebTokenError("invalid nbf value"));
          }
          if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
            return done(new NotBeforeError("jwt not active", new Date(payload.nbf * 1e3)));
          }
        }
        if (typeof payload.exp !== "undefined" && !options.ignoreExpiration) {
          if (typeof payload.exp !== "number") {
            return done(new JsonWebTokenError("invalid exp value"));
          }
          if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
            return done(new TokenExpiredError("jwt expired", new Date(payload.exp * 1e3)));
          }
        }
        if (options.audience) {
          const audiences = Array.isArray(options.audience) ? options.audience : [options.audience];
          const target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
          const match = target.some(function(targetAudience) {
            return audiences.some(function(audience) {
              return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
            });
          });
          if (!match) {
            return done(new JsonWebTokenError("jwt audience invalid. expected: " + audiences.join(" or ")));
          }
        }
        if (options.issuer) {
          const invalid_issuer = typeof options.issuer === "string" && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
          if (invalid_issuer) {
            return done(new JsonWebTokenError("jwt issuer invalid. expected: " + options.issuer));
          }
        }
        if (options.subject) {
          if (payload.sub !== options.subject) {
            return done(new JsonWebTokenError("jwt subject invalid. expected: " + options.subject));
          }
        }
        if (options.jwtid) {
          if (payload.jti !== options.jwtid) {
            return done(new JsonWebTokenError("jwt jwtid invalid. expected: " + options.jwtid));
          }
        }
        if (options.nonce) {
          if (payload.nonce !== options.nonce) {
            return done(new JsonWebTokenError("jwt nonce invalid. expected: " + options.nonce));
          }
        }
        if (options.maxAge) {
          if (typeof payload.iat !== "number") {
            return done(new JsonWebTokenError("iat required when maxAge is specified"));
          }
          const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
          if (typeof maxAgeTimestamp === "undefined") {
            return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
          }
          if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
            return done(new TokenExpiredError("maxAge exceeded", new Date(maxAgeTimestamp * 1e3)));
          }
        }
        if (options.complete === true) {
          const signature = decodedToken.signature;
          return done(null, {
            header,
            payload,
            signature
          });
        }
        return done(null, payload);
      });
    };
  }
});

// ../../node_modules/.pnpm/lodash.includes@4.3.0/node_modules/lodash.includes/index.js
var require_lodash = __commonJS({
  "../../node_modules/.pnpm/lodash.includes@4.3.0/node_modules/lodash.includes/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var argsTag = "[object Arguments]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var freeParseInt = parseInt;
    function arrayMap(array, iteratee) {
      var index = -1, length = array ? array.length : 0, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseValues(object, props) {
      return arrayMap(props, function(key) {
        return object[key];
      });
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeKeys = overArg(Object.keys, Object);
    var nativeMax = Math.max;
    function arrayLikeKeys(value, inherited) {
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function values(object) {
      return object ? baseValues(object, keys(object)) : [];
    }
    module2.exports = includes;
  }
});

// ../../node_modules/.pnpm/lodash.isboolean@3.0.3/node_modules/lodash.isboolean/index.js
var require_lodash2 = __commonJS({
  "../../node_modules/.pnpm/lodash.isboolean@3.0.3/node_modules/lodash.isboolean/index.js"(exports2, module2) {
    var boolTag = "[object Boolean]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isBoolean(value) {
      return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    module2.exports = isBoolean;
  }
});

// ../../node_modules/.pnpm/lodash.isinteger@4.0.4/node_modules/lodash.isinteger/index.js
var require_lodash3 = __commonJS({
  "../../node_modules/.pnpm/lodash.isinteger@4.0.4/node_modules/lodash.isinteger/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isInteger(value) {
      return typeof value == "number" && value == toInteger(value);
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module2.exports = isInteger;
  }
});

// ../../node_modules/.pnpm/lodash.isnumber@3.0.3/node_modules/lodash.isnumber/index.js
var require_lodash4 = __commonJS({
  "../../node_modules/.pnpm/lodash.isnumber@3.0.3/node_modules/lodash.isnumber/index.js"(exports2, module2) {
    var numberTag = "[object Number]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isNumber(value) {
      return typeof value == "number" || isObjectLike(value) && objectToString.call(value) == numberTag;
    }
    module2.exports = isNumber;
  }
});

// ../../node_modules/.pnpm/lodash.isplainobject@4.0.6/node_modules/lodash.isplainobject/index.js
var require_lodash5 = __commonJS({
  "../../node_modules/.pnpm/lodash.isplainobject@4.0.6/node_modules/lodash.isplainobject/index.js"(exports2, module2) {
    var objectTag = "[object Object]";
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    var objectToString = objectProto.toString;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isPlainObject(value) {
      if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    module2.exports = isPlainObject;
  }
});

// ../../node_modules/.pnpm/lodash.isstring@4.0.1/node_modules/lodash.isstring/index.js
var require_lodash6 = __commonJS({
  "../../node_modules/.pnpm/lodash.isstring@4.0.1/node_modules/lodash.isstring/index.js"(exports2, module2) {
    var stringTag = "[object String]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var isArray = Array.isArray;
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
    }
    module2.exports = isString;
  }
});

// ../../node_modules/.pnpm/lodash.once@4.1.1/node_modules/lodash.once/index.js
var require_lodash7 = __commonJS({
  "../../node_modules/.pnpm/lodash.once@4.1.1/node_modules/lodash.once/index.js"(exports2, module2) {
    var FUNC_ERROR_TEXT = "Expected a function";
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function before(n, func) {
      var result;
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = void 0;
        }
        return result;
      };
    }
    function once(func) {
      return before(2, func);
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module2.exports = once;
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/sign.js
var require_sign = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/sign.js"(exports2, module2) {
    var timespan = require_timespan();
    var PS_SUPPORTED = require_psSupported();
    var validateAsymmetricKey = require_validateAsymmetricKey();
    var jws = require_jws();
    var includes = require_lodash();
    var isBoolean = require_lodash2();
    var isInteger = require_lodash3();
    var isNumber = require_lodash4();
    var isPlainObject = require_lodash5();
    var isString = require_lodash6();
    var once = require_lodash7();
    var { KeyObject, createSecretKey, createPrivateKey } = require("crypto");
    var SUPPORTED_ALGS = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
    if (PS_SUPPORTED) {
      SUPPORTED_ALGS.splice(3, 0, "PS256", "PS384", "PS512");
    }
    var sign_options_schema = {
      expiresIn: { isValid: function(value) {
        return isInteger(value) || isString(value) && value;
      }, message: '"expiresIn" should be a number of seconds or string representing a timespan' },
      notBefore: { isValid: function(value) {
        return isInteger(value) || isString(value) && value;
      }, message: '"notBefore" should be a number of seconds or string representing a timespan' },
      audience: { isValid: function(value) {
        return isString(value) || Array.isArray(value);
      }, message: '"audience" must be a string or array' },
      algorithm: { isValid: includes.bind(null, SUPPORTED_ALGS), message: '"algorithm" must be a valid string enum value' },
      header: { isValid: isPlainObject, message: '"header" must be an object' },
      encoding: { isValid: isString, message: '"encoding" must be a string' },
      issuer: { isValid: isString, message: '"issuer" must be a string' },
      subject: { isValid: isString, message: '"subject" must be a string' },
      jwtid: { isValid: isString, message: '"jwtid" must be a string' },
      noTimestamp: { isValid: isBoolean, message: '"noTimestamp" must be a boolean' },
      keyid: { isValid: isString, message: '"keyid" must be a string' },
      mutatePayload: { isValid: isBoolean, message: '"mutatePayload" must be a boolean' },
      allowInsecureKeySizes: { isValid: isBoolean, message: '"allowInsecureKeySizes" must be a boolean' },
      allowInvalidAsymmetricKeyTypes: { isValid: isBoolean, message: '"allowInvalidAsymmetricKeyTypes" must be a boolean' }
    };
    var registered_claims_schema = {
      iat: { isValid: isNumber, message: '"iat" should be a number of seconds' },
      exp: { isValid: isNumber, message: '"exp" should be a number of seconds' },
      nbf: { isValid: isNumber, message: '"nbf" should be a number of seconds' }
    };
    function validate(schema, allowUnknown, object, parameterName) {
      if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
      }
      Object.keys(object).forEach(function(key) {
        const validator = schema[key];
        if (!validator) {
          if (!allowUnknown) {
            throw new Error('"' + key + '" is not allowed in "' + parameterName + '"');
          }
          return;
        }
        if (!validator.isValid(object[key])) {
          throw new Error(validator.message);
        }
      });
    }
    function validateOptions(options) {
      return validate(sign_options_schema, false, options, "options");
    }
    function validatePayload(payload) {
      return validate(registered_claims_schema, true, payload, "payload");
    }
    var options_to_payload = {
      "audience": "aud",
      "issuer": "iss",
      "subject": "sub",
      "jwtid": "jti"
    };
    var options_for_objects = [
      "expiresIn",
      "notBefore",
      "noTimestamp",
      "audience",
      "issuer",
      "subject",
      "jwtid"
    ];
    module2.exports = function(payload, secretOrPrivateKey, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      } else {
        options = options || {};
      }
      const isObjectPayload = typeof payload === "object" && !Buffer.isBuffer(payload);
      const header = Object.assign({
        alg: options.algorithm || "HS256",
        typ: isObjectPayload ? "JWT" : void 0,
        kid: options.keyid
      }, options.header);
      function failure(err) {
        if (callback) {
          return callback(err);
        }
        throw err;
      }
      if (!secretOrPrivateKey && options.algorithm !== "none") {
        return failure(new Error("secretOrPrivateKey must have a value"));
      }
      if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject)) {
        try {
          secretOrPrivateKey = createPrivateKey(secretOrPrivateKey);
        } catch (_) {
          try {
            secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === "string" ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
          } catch (_2) {
            return failure(new Error("secretOrPrivateKey is not valid key material"));
          }
        }
      }
      if (header.alg.startsWith("HS") && secretOrPrivateKey.type !== "secret") {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
      } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== "private") {
          return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith("ES") && secretOrPrivateKey.asymmetricKeyDetails !== void 0 && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
          return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
      }
      if (typeof payload === "undefined") {
        return failure(new Error("payload is required"));
      } else if (isObjectPayload) {
        try {
          validatePayload(payload);
        } catch (error) {
          return failure(error);
        }
        if (!options.mutatePayload) {
          payload = Object.assign({}, payload);
        }
      } else {
        const invalid_options = options_for_objects.filter(function(opt) {
          return typeof options[opt] !== "undefined";
        });
        if (invalid_options.length > 0) {
          return failure(new Error("invalid " + invalid_options.join(",") + " option for " + typeof payload + " payload"));
        }
      }
      if (typeof payload.exp !== "undefined" && typeof options.expiresIn !== "undefined") {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
      }
      if (typeof payload.nbf !== "undefined" && typeof options.notBefore !== "undefined") {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
      }
      try {
        validateOptions(options);
      } catch (error) {
        return failure(error);
      }
      if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
          validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error) {
          return failure(error);
        }
      }
      const timestamp = payload.iat || Math.floor(Date.now() / 1e3);
      if (options.noTimestamp) {
        delete payload.iat;
      } else if (isObjectPayload) {
        payload.iat = timestamp;
      }
      if (typeof options.notBefore !== "undefined") {
        try {
          payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err) {
          return failure(err);
        }
        if (typeof payload.nbf === "undefined") {
          return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
      }
      if (typeof options.expiresIn !== "undefined" && typeof payload === "object") {
        try {
          payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err) {
          return failure(err);
        }
        if (typeof payload.exp === "undefined") {
          return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
      }
      Object.keys(options_to_payload).forEach(function(key) {
        const claim = options_to_payload[key];
        if (typeof options[key] !== "undefined") {
          if (typeof payload[claim] !== "undefined") {
            return failure(new Error('Bad "options.' + key + '" option. The payload already has an "' + claim + '" property.'));
          }
          payload[claim] = options[key];
        }
      });
      const encoding = options.encoding || "utf8";
      if (typeof callback === "function") {
        callback = callback && once(callback);
        jws.createSign({
          header,
          privateKey: secretOrPrivateKey,
          payload,
          encoding
        }).once("error", callback).once("done", function(signature) {
          if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
          }
          callback(null, signature);
        });
      } else {
        let signature = jws.sign({ header, payload, secret: secretOrPrivateKey, encoding });
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
          throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
      }
    };
  }
});

// ../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/index.js
var require_jsonwebtoken = __commonJS({
  "../../node_modules/.pnpm/jsonwebtoken@9.0.3/node_modules/jsonwebtoken/index.js"(exports2, module2) {
    module2.exports = {
      decode: require_decode(),
      verify: require_verify(),
      sign: require_sign(),
      JsonWebTokenError: require_JsonWebTokenError(),
      NotBeforeError: require_NotBeforeError(),
      TokenExpiredError: require_TokenExpiredError()
    };
  }
});

// ../../node_modules/.pnpm/ag-auth@2.1.1/node_modules/ag-auth/index.js
var require_ag_auth = __commonJS({
  "../../node_modules/.pnpm/ag-auth@2.1.1/node_modules/ag-auth/index.js"(exports2, module2) {
    var jwt = require_jsonwebtoken();
    var scErrors = require_sc_errors();
    var InvalidArgumentsError = scErrors.InvalidArgumentsError;
    var AuthEngine = function() {
    };
    AuthEngine.prototype.verifyToken = function(signedToken, key, options) {
      options = options || {};
      let jwtOptions = Object.assign({}, options);
      delete jwtOptions.socket;
      if (typeof signedToken === "string" || signedToken == null) {
        return new Promise((resolve, reject) => {
          jwt.verify(signedToken || "", key, jwtOptions, (err, token) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(token);
          });
        });
      }
      return Promise.reject(
        new InvalidArgumentsError("Invalid token format - Token must be a string")
      );
    };
    AuthEngine.prototype.signToken = function(token, key, options) {
      options = options || {};
      let jwtOptions = Object.assign({}, options);
      return new Promise((resolve, reject) => {
        jwt.sign(token, key, jwtOptions, (err, signedToken) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(signedToken);
        });
      });
    };
    module2.exports = AuthEngine;
  }
});

// ../../node_modules/.pnpm/sc-formatter@4.0.0/node_modules/sc-formatter/index.js
var require_sc_formatter = __commonJS({
  "../../node_modules/.pnpm/sc-formatter@4.0.0/node_modules/sc-formatter/index.js"(exports2, module2) {
    var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var validJSONStartRegex = /^[ \n\r\t]*[{\[]/;
    var arrayBufferToBase64 = function(arraybuffer) {
      let bytes = new Uint8Array(arraybuffer);
      let len = bytes.length;
      let base64 = "";
      for (let i = 0; i < len; i += 3) {
        base64 += base64Chars[bytes[i] >> 2];
        base64 += base64Chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
        base64 += base64Chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
        base64 += base64Chars[bytes[i + 2] & 63];
      }
      if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
      } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
      }
      return base64;
    };
    var binaryToBase64Replacer = function(key, value) {
      if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
        return {
          base64: true,
          data: arrayBufferToBase64(value)
        };
      } else if (typeof Buffer !== "undefined") {
        if (value instanceof Buffer) {
          return {
            base64: true,
            data: value.toString("base64")
          };
        }
        if (value && value.type === "Buffer" && Array.isArray(value.data)) {
          let rehydratedBuffer;
          if (Buffer.from) {
            rehydratedBuffer = Buffer.from(value.data);
          } else {
            rehydratedBuffer = new Buffer(value.data);
          }
          return {
            base64: true,
            data: rehydratedBuffer.toString("base64")
          };
        }
      }
      return value;
    };
    module2.exports.decode = function(encodedMessage) {
      if (encodedMessage == null) {
        return null;
      }
      if (encodedMessage === "#1" || encodedMessage === "#2") {
        return encodedMessage;
      }
      let message = encodedMessage.toString();
      if (!validJSONStartRegex.test(message)) {
        return message;
      }
      try {
        return JSON.parse(message);
      } catch (err) {
      }
      return message;
    };
    module2.exports.encode = function(rawData) {
      if (rawData === "#1" || rawData === "#2") {
        return rawData;
      }
      return JSON.stringify(rawData, binaryToBase64Replacer);
    };
  }
});

// ../../node_modules/.pnpm/base64id@2.0.0/node_modules/base64id/lib/base64id.js
var require_base64id = __commonJS({
  "../../node_modules/.pnpm/base64id@2.0.0/node_modules/base64id/lib/base64id.js"(exports2, module2) {
    var crypto = require("crypto");
    var Base64Id = function() {
    };
    Base64Id.prototype.getRandomBytes = function(bytes) {
      var BUFFER_SIZE = 4096;
      var self = this;
      bytes = bytes || 12;
      if (bytes > BUFFER_SIZE) {
        return crypto.randomBytes(bytes);
      }
      var bytesInBuffer = parseInt(BUFFER_SIZE / bytes);
      var threshold = parseInt(bytesInBuffer * 0.85);
      if (!threshold) {
        return crypto.randomBytes(bytes);
      }
      if (this.bytesBufferIndex == null) {
        this.bytesBufferIndex = -1;
      }
      if (this.bytesBufferIndex == bytesInBuffer) {
        this.bytesBuffer = null;
        this.bytesBufferIndex = -1;
      }
      if (this.bytesBufferIndex == -1 || this.bytesBufferIndex > threshold) {
        if (!this.isGeneratingBytes) {
          this.isGeneratingBytes = true;
          crypto.randomBytes(BUFFER_SIZE, function(err, bytes2) {
            self.bytesBuffer = bytes2;
            self.bytesBufferIndex = 0;
            self.isGeneratingBytes = false;
          });
        }
        if (this.bytesBufferIndex == -1) {
          return crypto.randomBytes(bytes);
        }
      }
      var result = this.bytesBuffer.slice(bytes * this.bytesBufferIndex, bytes * (this.bytesBufferIndex + 1));
      this.bytesBufferIndex++;
      return result;
    };
    Base64Id.prototype.generateId = function() {
      var rand = Buffer.alloc(15);
      if (!rand.writeInt32BE) {
        return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString() + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
      }
      this.sequenceNumber = this.sequenceNumber + 1 | 0;
      rand.writeInt32BE(this.sequenceNumber, 11);
      if (crypto.randomBytes) {
        this.getRandomBytes(12).copy(rand);
      } else {
        [0, 4, 8].forEach(function(i) {
          rand.writeInt32BE(Math.random() * Math.pow(2, 32) | 0, i);
        });
      }
      return rand.toString("base64").replace(/\//g, "_").replace(/\+/g, "-");
    };
    exports2 = module2.exports = new Base64Id();
  }
});

// ../../node_modules/.pnpm/consumable-stream@2.0.0/node_modules/consumable-stream/index.js
var require_consumable_stream2 = __commonJS({
  "../../node_modules/.pnpm/consumable-stream@2.0.0/node_modules/consumable-stream/index.js"(exports2, module2) {
    var ConsumableStream = class {
      async next(timeout) {
        let asyncIterator = this.createConsumer(timeout);
        let result = await asyncIterator.next();
        asyncIterator.return();
        return result;
      }
      async once(timeout) {
        let result = await this.next(timeout);
        if (result.done) {
          await new Promise(() => {
          });
        }
        return result.value;
      }
      createConsumer() {
        throw new TypeError("Method must be overriden by subclass");
      }
      [Symbol.asyncIterator]() {
        return this.createConsumer();
      }
    };
    module2.exports = ConsumableStream;
  }
});

// ../../node_modules/.pnpm/ag-channel@5.0.0/node_modules/ag-channel/index.js
var require_ag_channel = __commonJS({
  "../../node_modules/.pnpm/ag-channel@5.0.0/node_modules/ag-channel/index.js"(exports2, module2) {
    var ConsumableStream = require_consumable_stream2();
    var AGChannel = class _AGChannel extends ConsumableStream {
      constructor(name, client, eventDemux, dataDemux) {
        super();
        this.PENDING = _AGChannel.PENDING;
        this.SUBSCRIBED = _AGChannel.SUBSCRIBED;
        this.UNSUBSCRIBED = _AGChannel.UNSUBSCRIBED;
        this.name = name;
        this.client = client;
        this._eventDemux = eventDemux;
        this._dataStream = dataDemux.stream(this.name);
      }
      createConsumer(timeout) {
        return this._dataStream.createConsumer(timeout);
      }
      listener(eventName) {
        return this._eventDemux.stream(`${this.name}/${eventName}`);
      }
      close() {
        this.client.closeChannel(this.name);
      }
      kill() {
        this.client.killChannel(this.name);
      }
      killOutputConsumer(consumerId) {
        if (this.hasOutputConsumer(consumerId)) {
          this.client.killChannelOutputConsumer(consumerId);
        }
      }
      killListenerConsumer(consumerId) {
        if (this.hasAnyListenerConsumer(consumerId)) {
          this.client.killChannelListenerConsumer(consumerId);
        }
      }
      getOutputConsumerStats(consumerId) {
        if (this.hasOutputConsumer(consumerId)) {
          return this.client.getChannelOutputConsumerStats(consumerId);
        }
        return void 0;
      }
      getListenerConsumerStats(consumerId) {
        if (this.hasAnyListenerConsumer(consumerId)) {
          return this.client.getChannelListenerConsumerStats(consumerId);
        }
        return void 0;
      }
      getBackpressure() {
        return this.client.getChannelBackpressure(this.name);
      }
      getListenerConsumerBackpressure(consumerId) {
        if (this.hasAnyListenerConsumer(consumerId)) {
          return this.client.getChannelListenerConsumerBackpressure(consumerId);
        }
        return 0;
      }
      getOutputConsumerBackpressure(consumerId) {
        if (this.hasOutputConsumer(consumerId)) {
          return this.client.getChannelOutputConsumerBackpressure(consumerId);
        }
        return 0;
      }
      closeOutput() {
        this.client.channelCloseOutput(this.name);
      }
      closeListener(eventName) {
        this.client.channelCloseListener(this.name, eventName);
      }
      closeAllListeners() {
        this.client.channelCloseAllListeners(this.name);
      }
      killOutput() {
        this.client.channelKillOutput(this.name);
      }
      killListener(eventName) {
        this.client.channelKillListener(this.name, eventName);
      }
      killAllListeners() {
        this.client.channelKillAllListeners(this.name);
      }
      getOutputConsumerStatsList() {
        return this.client.channelGetOutputConsumerStatsList(this.name);
      }
      getListenerConsumerStatsList(eventName) {
        return this.client.channelGetListenerConsumerStatsList(this.name, eventName);
      }
      getAllListenersConsumerStatsList() {
        return this.client.channelGetAllListenersConsumerStatsList(this.name);
      }
      getOutputBackpressure() {
        return this.client.channelGetOutputBackpressure(this.name);
      }
      getListenerBackpressure(eventName) {
        return this.client.channelGetListenerBackpressure(this.name, eventName);
      }
      getAllListenersBackpressure() {
        return this.client.channelGetAllListenersBackpressure(this.name);
      }
      hasOutputConsumer(consumerId) {
        return this.client.channelHasOutputConsumer(this.name, consumerId);
      }
      hasListenerConsumer(eventName, consumerId) {
        return this.client.channelHasListenerConsumer(this.name, eventName, consumerId);
      }
      hasAnyListenerConsumer(consumerId) {
        return this.client.channelHasAnyListenerConsumer(this.name, consumerId);
      }
      get state() {
        return this.client.getChannelState(this.name);
      }
      set state(value) {
        throw new Error("Cannot directly set channel state");
      }
      get options() {
        return this.client.getChannelOptions(this.name);
      }
      set options(value) {
        throw new Error("Cannot directly set channel options");
      }
      subscribe(options) {
        this.client.subscribe(this.name, options);
      }
      unsubscribe() {
        this.client.unsubscribe(this.name);
      }
      isSubscribed(includePending) {
        return this.client.isSubscribed(this.name, includePending);
      }
      transmitPublish(data) {
        return this.client.transmitPublish(this.name, data);
      }
      invokePublish(data) {
        return this.client.invokePublish(this.name, data);
      }
    };
    AGChannel.PENDING = "pending";
    AGChannel.SUBSCRIBED = "subscribed";
    AGChannel.UNSUBSCRIBED = "unsubscribed";
    module2.exports = AGChannel;
  }
});

// ../../node_modules/.pnpm/ag-simple-broker@6.0.1/node_modules/ag-simple-broker/index.js
var require_ag_simple_broker = __commonJS({
  "../../node_modules/.pnpm/ag-simple-broker@6.0.1/node_modules/ag-simple-broker/index.js"(exports2, module2) {
    var AsyncStreamEmitter = require_async_stream_emitter();
    var StreamDemux = require_stream_demux();
    var AGChannel = require_ag_channel();
    function SimpleExchange(broker) {
      AsyncStreamEmitter.call(this);
      this.id = "exchange";
      this._broker = broker;
      this._channelMap = {};
      this._channelEventDemux = new StreamDemux();
      this._channelDataDemux = new StreamDemux();
    }
    SimpleExchange.prototype = Object.create(AsyncStreamEmitter.prototype);
    SimpleExchange.prototype.transmit = function(event, packet) {
      if (event === "#publish") {
        this._channelDataDemux.write(packet.channel, packet.data);
      }
    };
    SimpleExchange.prototype.getBackpressure = function() {
      return Math.max(
        this.getAllListenersBackpressure(),
        this.getAllChannelsBackpressure()
      );
    };
    SimpleExchange.prototype.destroy = function() {
      this._broker.closeAllListeners();
    };
    SimpleExchange.prototype._triggerChannelSubscribe = function(channel) {
      let channelName = channel.name;
      channel.state = AGChannel.SUBSCRIBED;
      this._channelEventDemux.write(`${channelName}/subscribe`, {});
      this._broker.subscribeClient(this, channelName);
      this.emit("subscribe", { channel: channelName });
    };
    SimpleExchange.prototype._triggerChannelUnsubscribe = function(channel) {
      let channelName = channel.name;
      delete this._channelMap[channelName];
      if (channel.state === AGChannel.SUBSCRIBED) {
        this._channelEventDemux.write(`${channelName}/unsubscribe`, {});
        this._broker.unsubscribeClient(this, channelName);
        this.emit("unsubscribe", { channel: channelName });
      }
    };
    SimpleExchange.prototype.transmitPublish = async function(channelName, data) {
      return this._broker.transmitPublish(channelName, data);
    };
    SimpleExchange.prototype.invokePublish = async function(channelName, data) {
      return this._broker.invokePublish(channelName, data);
    };
    SimpleExchange.prototype.subscribe = function(channelName) {
      let channel = this._channelMap[channelName];
      if (!channel) {
        channel = {
          name: channelName,
          state: AGChannel.PENDING
        };
        this._channelMap[channelName] = channel;
        this._triggerChannelSubscribe(channel);
      }
      let channelIterable = new AGChannel(
        channelName,
        this,
        this._channelEventDemux,
        this._channelDataDemux
      );
      return channelIterable;
    };
    SimpleExchange.prototype.unsubscribe = async function(channelName) {
      let channel = this._channelMap[channelName];
      if (channel) {
        this._triggerChannelUnsubscribe(channel);
      }
    };
    SimpleExchange.prototype.channel = function(channelName) {
      let currentChannel = this._channelMap[channelName];
      let channelIterable = new AGChannel(
        channelName,
        this,
        this._channelEventDemux,
        this._channelDataDemux
      );
      return channelIterable;
    };
    SimpleExchange.prototype.closeChannel = function(channelName) {
      this.channelCloseOutput(channelName);
      this.channelCloseAllListeners(channelName);
    };
    SimpleExchange.prototype.closeAllChannelOutputs = function() {
      this._channelDataDemux.closeAll();
    };
    SimpleExchange.prototype.closeAllChannelListeners = function() {
      this._channelEventDemux.closeAll();
    };
    SimpleExchange.prototype.closeAllChannels = function() {
      this.closeAllChannelOutputs();
      this.closeAllChannelListeners();
    };
    SimpleExchange.prototype.killChannel = function(channelName) {
      this.channelKillOutput(channelName);
      this.channelKillAllListeners(channelName);
    };
    SimpleExchange.prototype.killAllChannelOutputs = function() {
      this._channelDataDemux.killAll();
    };
    SimpleExchange.prototype.killAllChannelListeners = function() {
      this._channelEventDemux.killAll();
    };
    SimpleExchange.prototype.killAllChannels = function() {
      this.killAllChannelOutputs();
      this.killAllChannelListeners();
    };
    SimpleExchange.prototype.killChannelOutputConsumer = function(consumerId) {
      this._channelDataDemux.killConsumer(consumerId);
    };
    SimpleExchange.prototype.killChannelListenerConsumer = function(consumerId) {
      this._channelEventDemux.killConsumer(consumerId);
    };
    SimpleExchange.prototype.getChannelOutputConsumerStats = function(consumerId) {
      return this._channelDataDemux.getConsumerStats(consumerId);
    };
    SimpleExchange.prototype.getChannelListenerConsumerStats = function(consumerId) {
      return this._channelEventDemux.getConsumerStats(consumerId);
    };
    SimpleExchange.prototype.getAllChannelOutputsConsumerStatsList = function() {
      return this._channelDataDemux.getConsumerStatsListAll();
    };
    SimpleExchange.prototype.getAllChannelListenersConsumerStatsList = function() {
      return this._channelEventDemux.getConsumerStatsListAll();
    };
    SimpleExchange.prototype.getChannelBackpressure = function(channelName) {
      return Math.max(
        this.channelGetOutputBackpressure(channelName),
        this.channelGetAllListenersBackpressure(channelName)
      );
    };
    SimpleExchange.prototype.getAllChannelOutputsBackpressure = function() {
      return this._channelDataDemux.getBackpressureAll();
    };
    SimpleExchange.prototype.getAllChannelListenersBackpressure = function() {
      return this._channelEventDemux.getBackpressureAll();
    };
    SimpleExchange.prototype.getAllChannelsBackpressure = function() {
      return Math.max(
        this.getAllChannelOutputsBackpressure(),
        this.getAllChannelListenersBackpressure()
      );
    };
    SimpleExchange.prototype.getChannelListenerConsumerBackpressure = function(consumerId) {
      return this._channelEventDemux.getConsumerBackpressure(consumerId);
    };
    SimpleExchange.prototype.getChannelOutputConsumerBackpressure = function(consumerId) {
      return this._channelDataDemux.getConsumerBackpressure(consumerId);
    };
    SimpleExchange.prototype.hasAnyChannelOutputConsumer = function(consumerId) {
      return this._channelDataDemux.hasConsumerAll(consumerId);
    };
    SimpleExchange.prototype.hasAnyChannelListenerConsumer = function(consumerId) {
      return this._channelEventDemux.hasConsumerAll(consumerId);
    };
    SimpleExchange.prototype.getChannelState = function(channelName) {
      let channel = this._channelMap[channelName];
      if (channel) {
        return channel.state;
      }
      return AGChannel.UNSUBSCRIBED;
    };
    SimpleExchange.prototype.getChannelOptions = function(channelName) {
      return {};
    };
    SimpleExchange.prototype._getAllChannelStreamNames = function(channelName) {
      let streamNamesLookup = this._channelEventDemux.getConsumerStatsListAll().filter((stats) => {
        return stats.stream.indexOf(`${channelName}/`) === 0;
      }).reduce((accumulator, stats) => {
        accumulator[stats.stream] = true;
        return accumulator;
      }, {});
      return Object.keys(streamNamesLookup);
    };
    SimpleExchange.prototype.channelCloseOutput = function(channelName) {
      this._channelDataDemux.close(channelName);
    };
    SimpleExchange.prototype.channelCloseListener = function(channelName, eventName) {
      this._channelEventDemux.close(`${channelName}/${eventName}`);
    };
    SimpleExchange.prototype.channelCloseAllListeners = function(channelName) {
      let listenerStreams = this._getAllChannelStreamNames(channelName).forEach((streamName) => {
        this._channelEventDemux.close(streamName);
      });
    };
    SimpleExchange.prototype.channelKillOutput = function(channelName) {
      this._channelDataDemux.kill(channelName);
    };
    SimpleExchange.prototype.channelKillListener = function(channelName, eventName) {
      this._channelEventDemux.kill(`${channelName}/${eventName}`);
    };
    SimpleExchange.prototype.channelKillAllListeners = function(channelName) {
      let listenerStreams = this._getAllChannelStreamNames(channelName).forEach((streamName) => {
        this._channelEventDemux.kill(streamName);
      });
    };
    SimpleExchange.prototype.channelGetOutputConsumerStatsList = function(channelName) {
      return this._channelDataDemux.getConsumerStatsList(channelName);
    };
    SimpleExchange.prototype.channelGetListenerConsumerStatsList = function(channelName, eventName) {
      return this._channelEventDemux.getConsumerStatsList(`${channelName}/${eventName}`);
    };
    SimpleExchange.prototype.channelGetAllListenersConsumerStatsList = function(channelName) {
      return this._getAllChannelStreamNames(channelName).map((streamName) => {
        return this._channelEventDemux.getConsumerStatsList(streamName);
      }).reduce((accumulator, statsList) => {
        statsList.forEach((stats) => {
          accumulator.push(stats);
        });
        return accumulator;
      }, []);
    };
    SimpleExchange.prototype.channelGetOutputBackpressure = function(channelName) {
      return this._channelDataDemux.getBackpressure(channelName);
    };
    SimpleExchange.prototype.channelGetListenerBackpressure = function(channelName, eventName) {
      return this._channelEventDemux.getBackpressure(`${channelName}/${eventName}`);
    };
    SimpleExchange.prototype.channelGetAllListenersBackpressure = function(channelName) {
      let listenerStreamBackpressures = this._getAllChannelStreamNames(channelName).map((streamName) => {
        return this._channelEventDemux.getBackpressure(streamName);
      });
      return Math.max(...listenerStreamBackpressures.concat(0));
    };
    SimpleExchange.prototype.channelHasOutputConsumer = function(channelName, consumerId) {
      return this._channelDataDemux.hasConsumer(channelName, consumerId);
    };
    SimpleExchange.prototype.channelHasListenerConsumer = function(channelName, eventName, consumerId) {
      return this._channelEventDemux.hasConsumer(`${channelName}/${eventName}`, consumerId);
    };
    SimpleExchange.prototype.channelHasAnyListenerConsumer = function(channelName, consumerId) {
      return this._getAllChannelStreamNames(channelName).some((streamName) => {
        return this._channelEventDemux.hasConsumer(streamName, consumerId);
      });
    };
    SimpleExchange.prototype.subscriptions = function(includePending) {
      let subs = [];
      Object.keys(this._channelMap).forEach((channelName) => {
        if (includePending || this._channelMap[channelName].state === AGChannel.SUBSCRIBED) {
          subs.push(channelName);
        }
      });
      return subs;
    };
    SimpleExchange.prototype.isSubscribed = function(channelName, includePending) {
      let channel = this._channelMap[channelName];
      if (includePending) {
        return !!channel;
      }
      return !!channel && channel.state === AGChannel.SUBSCRIBED;
    };
    function AGSimpleBroker() {
      AsyncStreamEmitter.call(this);
      this.isReady = false;
      this._codec = null;
      this._exchangeClient = new SimpleExchange(this);
      this._clientSubscribers = {};
      this._clientSubscribersCounter = {};
      setTimeout(() => {
        this.isReady = true;
        this.emit("ready", {});
      }, 0);
    }
    AGSimpleBroker.prototype = Object.create(AsyncStreamEmitter.prototype);
    AGSimpleBroker.prototype.exchange = function() {
      return this._exchangeClient;
    };
    AGSimpleBroker.prototype.subscribeClient = async function(client, channelName) {
      if (!this._clientSubscribers[channelName]) {
        this._clientSubscribers[channelName] = {};
        this._clientSubscribersCounter[channelName] = 0;
        this.emit("subscribe", {
          channel: channelName
        });
      }
      if (!this._clientSubscribers[channelName][client.id]) {
        this._clientSubscribersCounter[channelName]++;
      }
      this._clientSubscribers[channelName][client.id] = client;
    };
    AGSimpleBroker.prototype.subscribeSocket = AGSimpleBroker.prototype.subscribeClient;
    AGSimpleBroker.prototype.unsubscribeClient = async function(client, channelName) {
      if (this._clientSubscribers[channelName]) {
        if (this._clientSubscribers[channelName][client.id]) {
          this._clientSubscribersCounter[channelName]--;
          delete this._clientSubscribers[channelName][client.id];
          if (this._clientSubscribersCounter[channelName] <= 0) {
            delete this._clientSubscribers[channelName];
            delete this._clientSubscribersCounter[channelName];
            this.emit("unsubscribe", {
              channel: channelName
            });
          }
        }
      }
    };
    AGSimpleBroker.prototype.unsubscribeSocket = AGSimpleBroker.prototype.unsubscribeClient;
    AGSimpleBroker.prototype.subscriptions = function() {
      return Object.keys(this._clientSubscribers);
    };
    AGSimpleBroker.prototype.isSubscribed = function(channelName) {
      return !!this._clientSubscribers[channelName];
    };
    AGSimpleBroker.prototype.setCodecEngine = function(codec) {
      this._codec = codec;
    };
    AGSimpleBroker.prototype.invokePublish = async function(channelName, data, suppressEvent) {
      return this.transmitPublish(channelName, data, suppressEvent);
    };
    AGSimpleBroker.prototype.transmitPublish = async function(channelName, data, suppressEvent) {
      let packet = {
        channel: channelName,
        data
      };
      let transmitOptions = {};
      if (this._codec) {
        try {
          transmitOptions.stringifiedData = this._codec.encode({
            event: "#publish",
            data: packet
          });
        } catch (error) {
          this.emit("error", { error });
          return;
        }
      }
      let subscriberClients = this._clientSubscribers[channelName] || {};
      Object.keys(subscriberClients).forEach((i) => {
        subscriberClients[i].transmit("#publish", packet, transmitOptions);
      });
      if (!suppressEvent) {
        this.emit("publish", packet);
      }
    };
    module2.exports = AGSimpleBroker;
  }
});

// ../../node_modules/.pnpm/socketcluster-server@19.2.2/node_modules/socketcluster-server/server.js
var require_server = __commonJS({
  "../../node_modules/.pnpm/socketcluster-server@19.2.2/node_modules/socketcluster-server/server.js"(exports2, module2) {
    var AGServerSocket = require_serversocket();
    var AuthEngine = require_ag_auth();
    var formatter = require_sc_formatter();
    var base64id = require_base64id();
    var url = require("url");
    var crypto = require("crypto");
    var AGSimpleBroker = require_ag_simple_broker();
    var AsyncStreamEmitter = require_async_stream_emitter();
    var WritableConsumableStream = require_writable_consumable_stream();
    var AGAction = require_action();
    var scErrors = require_sc_errors();
    var SilentMiddlewareBlockedError = scErrors.SilentMiddlewareBlockedError;
    var InvalidArgumentsError = scErrors.InvalidArgumentsError;
    var InvalidOptionsError = scErrors.InvalidOptionsError;
    var InvalidActionError = scErrors.InvalidActionError;
    var ServerProtocolError = scErrors.ServerProtocolError;
    function AGServer(options) {
      AsyncStreamEmitter.call(this);
      let opts = {
        brokerEngine: new AGSimpleBroker(),
        wsEngine: "ws",
        wsEngineServerOptions: {},
        maxPayload: null,
        allowClientPublish: true,
        ackTimeout: 1e4,
        handshakeTimeout: 1e4,
        strictHandshake: true,
        pingTimeout: 3e4,
        pingTimeoutDisabled: false,
        pingInterval: 8e3,
        origins: "*:*",
        path: "/socketcluster/",
        protocolVersion: 2,
        authDefaultExpiry: 86400,
        batchOnHandshake: false,
        batchOnHandshakeDuration: 400,
        batchInterval: 50,
        middlewareEmitFailures: true,
        socketStreamCleanupMode: "kill",
        cloneData: false
      };
      this.options = Object.assign(opts, options);
      this._middleware = {};
      this.origins = opts.origins;
      this._allowAllOrigins = this.origins.indexOf("*:*") !== -1;
      this.ackTimeout = opts.ackTimeout;
      this.handshakeTimeout = opts.handshakeTimeout;
      this.pingInterval = opts.pingInterval;
      this.pingTimeout = opts.pingTimeout;
      this.pingTimeoutDisabled = opts.pingTimeoutDisabled;
      this.allowClientPublish = opts.allowClientPublish;
      this.perMessageDeflate = opts.perMessageDeflate;
      this.httpServer = opts.httpServer;
      this.socketChannelLimit = opts.socketChannelLimit;
      this.protocolVersion = opts.protocolVersion;
      this.strictHandshake = opts.strictHandshake;
      this.brokerEngine = opts.brokerEngine;
      this.middlewareEmitFailures = opts.middlewareEmitFailures;
      this._path = opts.path;
      (async () => {
        for await (let { error } of this.brokerEngine.listener("error")) {
          this.emitWarning(error);
        }
      })();
      if (this.brokerEngine.isReady) {
        this.isReady = true;
        this.emit("ready", {});
      } else {
        this.isReady = false;
        (async () => {
          await this.brokerEngine.listener("ready").once();
          this.isReady = true;
          this.emit("ready", {});
        })();
      }
      let wsEngine = typeof opts.wsEngine === "string" ? require(opts.wsEngine) : opts.wsEngine;
      if (!wsEngine || !wsEngine.Server) {
        throw new InvalidOptionsError(
          "The wsEngine option must be a path or module name which points to a valid WebSocket engine module with a compatible interface"
        );
      }
      let WSServer = wsEngine.Server;
      if (opts.authPrivateKey != null || opts.authPublicKey != null) {
        if (opts.authPrivateKey == null) {
          throw new InvalidOptionsError(
            "The authPrivateKey option must be specified if authPublicKey is specified"
          );
        } else if (opts.authPublicKey == null) {
          throw new InvalidOptionsError(
            "The authPublicKey option must be specified if authPrivateKey is specified"
          );
        }
        this.signatureKey = opts.authPrivateKey;
        this.verificationKey = opts.authPublicKey;
      } else {
        if (opts.authKey == null) {
          opts.authKey = crypto.randomBytes(32).toString("hex");
        }
        this.signatureKey = opts.authKey;
        this.verificationKey = opts.authKey;
      }
      this.defaultVerificationOptions = {};
      if (opts.authVerifyAlgorithms != null) {
        this.defaultVerificationOptions.algorithms = opts.authVerifyAlgorithms;
      } else if (opts.authAlgorithm != null) {
        this.defaultVerificationOptions.algorithms = [opts.authAlgorithm];
      }
      this.defaultSignatureOptions = {
        expiresIn: opts.authDefaultExpiry
      };
      if (opts.authAlgorithm != null) {
        this.defaultSignatureOptions.algorithm = opts.authAlgorithm;
      }
      if (opts.authEngine) {
        this.auth = opts.authEngine;
      } else {
        this.auth = new AuthEngine();
      }
      if (opts.codecEngine) {
        this.codec = opts.codecEngine;
      } else {
        this.codec = formatter;
      }
      this.brokerEngine.setCodecEngine(this.codec);
      this.exchange = this.brokerEngine.exchange();
      this.clients = {};
      this.clientsCount = 0;
      this.pendingClients = {};
      this.pendingClientsCount = 0;
      let wsServerOptions = opts.wsEngineServerOptions || {};
      wsServerOptions.server = this.httpServer;
      wsServerOptions.verifyClient = this.verifyHandshake.bind(this);
      if (wsServerOptions.path == null && this._path != null) {
        wsServerOptions.path = this._path;
      }
      if (wsServerOptions.perMessageDeflate == null && this.perMessageDeflate != null) {
        wsServerOptions.perMessageDeflate = this.perMessageDeflate;
      }
      if (wsServerOptions.handleProtocols == null && opts.handleProtocols != null) {
        wsServerOptions.handleProtocols = opts.handleProtocols;
      }
      if (wsServerOptions.maxPayload == null && opts.maxPayload != null) {
        wsServerOptions.maxPayload = opts.maxPayload;
      }
      if (wsServerOptions.clientTracking == null) {
        wsServerOptions.clientTracking = false;
      }
      this.wsServer = new WSServer(wsServerOptions);
      this.wsServer.on("error", this._handleServerError.bind(this));
      this.wsServer.on("connection", this._handleSocketConnection.bind(this));
    }
    AGServer.prototype = Object.create(AsyncStreamEmitter.prototype);
    AGServer.prototype.SYMBOL_MIDDLEWARE_HANDSHAKE_STREAM = AGServer.SYMBOL_MIDDLEWARE_HANDSHAKE_STREAM = Symbol("handshakeStream");
    AGServer.prototype.MIDDLEWARE_HANDSHAKE = AGServer.MIDDLEWARE_HANDSHAKE = "handshake";
    AGServer.prototype.MIDDLEWARE_INBOUND_RAW = AGServer.MIDDLEWARE_INBOUND_RAW = "inboundRaw";
    AGServer.prototype.MIDDLEWARE_INBOUND = AGServer.MIDDLEWARE_INBOUND = "inbound";
    AGServer.prototype.MIDDLEWARE_OUTBOUND = AGServer.MIDDLEWARE_OUTBOUND = "outbound";
    AGServer.prototype.setAuthEngine = function(authEngine) {
      this.auth = authEngine;
    };
    AGServer.prototype.setCodecEngine = function(codecEngine) {
      this.codec = codecEngine;
      this.brokerEngine.setCodecEngine(codecEngine);
    };
    AGServer.prototype.emitError = function(error) {
      this.emit("error", { error });
    };
    AGServer.prototype.emitWarning = function(warning) {
      this.emit("warning", { warning });
    };
    AGServer.prototype._handleServerError = function(error) {
      if (typeof error === "string") {
        error = new ServerProtocolError(error);
      }
      this.emitError(error);
    };
    AGServer.prototype._handleSocketConnection = function(wsSocket, upgradeReq) {
      if (!wsSocket.upgradeReq) {
        wsSocket.upgradeReq = upgradeReq;
      }
      let socketId = this.generateId();
      let agSocket = new AGServerSocket(socketId, this, wsSocket, this.protocolVersion);
      agSocket.exchange = this.exchange;
      let inboundRawMiddleware = this._middleware[this.MIDDLEWARE_INBOUND_RAW];
      if (inboundRawMiddleware) {
        inboundRawMiddleware(agSocket.middlewareInboundRawStream);
      }
      let inboundMiddleware = this._middleware[this.MIDDLEWARE_INBOUND];
      if (inboundMiddleware) {
        inboundMiddleware(agSocket.middlewareInboundStream);
      }
      let outboundMiddleware = this._middleware[this.MIDDLEWARE_OUTBOUND];
      if (outboundMiddleware) {
        outboundMiddleware(agSocket.middlewareOutboundStream);
      }
      this.emit("handshake", { socket: agSocket });
    };
    AGServer.prototype.close = function(keepSocketsOpen) {
      this.isReady = false;
      return new Promise((resolve, reject) => {
        this.wsServer.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
        if (!keepSocketsOpen) {
          for (let socket of Object.values(this.clients)) {
            socket.terminate();
          }
        }
      });
    };
    AGServer.prototype.getPath = function() {
      return this._path;
    };
    AGServer.prototype.generateId = function() {
      return base64id.generateId();
    };
    AGServer.prototype.setMiddleware = function(type, middleware) {
      if (type !== this.MIDDLEWARE_HANDSHAKE && type !== this.MIDDLEWARE_INBOUND_RAW && type !== this.MIDDLEWARE_INBOUND && type !== this.MIDDLEWARE_OUTBOUND) {
        throw new InvalidArgumentsError(
          `Middleware ${type} type is not supported`
        );
      }
      if (this._middleware[type]) {
        throw new InvalidActionError(`Middleware ${type} type has already been set`);
      }
      this._middleware[type] = middleware;
    };
    AGServer.prototype.removeMiddleware = function(type) {
      delete this._middleware[type];
    };
    AGServer.prototype.hasMiddleware = function(type) {
      return !!this._middleware[type];
    };
    AGServer.prototype._processMiddlewareAction = async function(middlewareStream, action, socket) {
      if (!this.hasMiddleware(middlewareStream.type)) {
        return { data: action.data, options: null };
      }
      middlewareStream.write(action);
      let newData;
      let options = null;
      try {
        let result = await action.promise;
        if (result) {
          newData = result.data;
          options = result.options;
        }
      } catch (error) {
        let clientError;
        if (!error) {
          error = new SilentMiddlewareBlockedError(
            `The ${action.type} AGAction was blocked by ${middlewareStream.type} middleware`,
            middlewareStream.type
          );
          clientError = error;
        } else if (error.silent) {
          clientError = new SilentMiddlewareBlockedError(
            `The ${action.type} AGAction was blocked by ${middlewareStream.type} middleware`,
            middlewareStream.type
          );
        } else {
          clientError = error;
        }
        if (this.middlewareEmitFailures) {
          if (socket) {
            socket.emitError(error);
          } else {
            this.emitWarning(error);
          }
        }
        throw clientError;
      }
      if (newData === void 0) {
        newData = action.data;
      }
      return { data: newData, options };
    };
    AGServer.prototype.verifyHandshake = async function(info, callback) {
      let req = info.req;
      let origin = info.origin;
      if (typeof origin !== "string" || origin === "null") {
        origin = "*";
      }
      let ok = false;
      if (this._allowAllOrigins) {
        ok = true;
      } else {
        try {
          let parts = url.parse(origin);
          parts.port = parts.port || (parts.protocol === "https:" ? 443 : 80);
          ok = ~this.origins.indexOf(parts.hostname + ":" + parts.port) || ~this.origins.indexOf(parts.hostname + ":*") || ~this.origins.indexOf("*:" + parts.port);
        } catch (e) {
        }
      }
      let middlewareHandshakeStream = new WritableConsumableStream();
      middlewareHandshakeStream.type = this.MIDDLEWARE_HANDSHAKE;
      req[this.SYMBOL_MIDDLEWARE_HANDSHAKE_STREAM] = middlewareHandshakeStream;
      let handshakeMiddleware = this._middleware[this.MIDDLEWARE_HANDSHAKE];
      if (handshakeMiddleware) {
        handshakeMiddleware(middlewareHandshakeStream);
      }
      let action = new AGAction();
      action.request = req;
      action.type = AGAction.HANDSHAKE_WS;
      try {
        await this._processMiddlewareAction(middlewareHandshakeStream, action);
      } catch (error2) {
        middlewareHandshakeStream.close();
        callback(false, 401, typeof error2 === "string" ? error2 : error2.message);
        return;
      }
      if (ok) {
        callback(true);
        return;
      }
      let error = new ServerProtocolError(
        `Failed to authorize socket handshake - Invalid origin: ${origin}`
      );
      this.emitWarning(error);
      middlewareHandshakeStream.close();
      callback(false, 403, error.message);
    };
    module2.exports = AGServer;
  }
});

// ../../node_modules/.pnpm/socketcluster-server@19.2.2/node_modules/socketcluster-server/index.js
var require_socketcluster_server = __commonJS({
  "../../node_modules/.pnpm/socketcluster-server@19.2.2/node_modules/socketcluster-server/index.js"(exports2, module2) {
    var http2 = require("http");
    module2.exports.AGServer = require_server();
    module2.exports.AGServerSocket = require_serversocket();
    module2.exports.AGRequest = require_ag_request();
    module2.exports.listen = function(port, options, fn) {
      if (typeof options === "function") {
        fn = options;
        options = {};
      }
      let server = http2.createServer((req, res) => {
        res.writeHead(501);
        res.end("Not Implemented");
      });
      let socketClusterServer = module2.exports.attach(server, options);
      socketClusterServer.httpServer = server;
      server.listen(port, fn);
      return socketClusterServer;
    };
    module2.exports.attach = function(server, options) {
      if (options == null) {
        options = {};
      }
      options.httpServer = server;
      let socketClusterServer = new module2.exports.AGServer(options);
      return socketClusterServer;
    };
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var net = __toESM(require("node:net"));
var path = __toESM(require("node:path"));
var fs = __toESM(require("node:fs"));

// src/server.ts
var http = __toESM(require("node:http"));
async function startServer(port) {
  const scsModule = await Promise.resolve().then(() => __toESM(require_socketcluster_server()));
  const socketClusterServer = scsModule.default ?? scsModule;
  const httpServer = http.createServer();
  const agServer = socketClusterServer.attach(httpServer, {
    allowClientPublish: false
  });
  agServer.setMiddleware(
    agServer.MIDDLEWARE_INBOUND,
    async (middlewareStream) => {
      for await (const action of middlewareStream) {
        if (action.type === action.TRANSMIT) {
          const channel = action.receiver;
          const data = action.data;
          if (channel.startsWith("sc-") || channel === "respond" || channel === "log") {
            void agServer.exchange.transmitPublish(channel, data);
          } else if (channel === "log-noid") {
            void agServer.exchange.transmitPublish("log", { id: action.socket.id, data });
          }
        }
        action.allow();
      }
    }
  );
  void (async () => {
    for await (const { socket } of agServer.listener("connection")) {
      void (async () => {
        for await (const request of socket.procedure("login")) {
          const credentials = request.data;
          const channelToWatch = credentials === "master" ? "respond" : "log";
          request.end(channelToWatch);
        }
      })();
      void (async () => {
        for await (const _ of socket.listener("disconnect")) {
          const channel = agServer.exchange.channel("sc-" + socket.id);
          channel.unsubscribe();
        }
      })();
    }
  })();
  await new Promise((resolve) => {
    httpServer.listen(port, "127.0.0.1", () => resolve());
  });
  await agServer.listener("ready").once();
  return {
    port,
    async dispose() {
      try {
        agServer.close();
      } catch {
      }
      await new Promise((resolve) => httpServer.close(() => resolve()));
    }
  };
}

// src/extension.ts
var serverPromise;
var panel;
var statusItem;
async function isPortFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(false));
    srv.once("listening", () => srv.close(() => resolve(true)));
    srv.listen(port, "127.0.0.1");
  });
}
async function pickPort(preferred) {
  for (const p of [preferred, preferred + 1, preferred + 2]) {
    if (await isPortFree(p)) return p;
  }
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once("error", reject);
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      srv.close(() => resolve(port));
    });
  });
}
function ensureServer() {
  if (serverPromise) return serverPromise;
  const cfg = vscode.workspace.getConfiguration("vitestReduxDevTools");
  const preferred = cfg.get("port", 8765);
  serverPromise = (async () => {
    const port = await pickPort(preferred);
    return startServer(port);
  })().catch((err) => {
    serverPromise = void 0;
    throw err;
  });
  return serverPromise;
}
function ensureStatusItem() {
  if (statusItem) return statusItem;
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusItem.command = "vitestReduxDevTools.open";
  statusItem.tooltip = "Open Redux DevTools panel";
  return statusItem;
}
function updateStatus(port) {
  const item = ensureStatusItem();
  item.text = `$(debug-alt) Redux DevTools :${port}`;
  item.show();
}
function resolveWebviewAssets(context, webview) {
  const dir = vscode.Uri.joinPath(context.extensionUri, "dist", "webview");
  return {
    reactJs: webview.asWebviewUri(vscode.Uri.joinPath(dir, "react.production.min.js")),
    reactDomJs: webview.asWebviewUri(vscode.Uri.joinPath(dir, "react-dom.production.min.js")),
    appJs: webview.asWebviewUri(vscode.Uri.joinPath(dir, "redux-devtools-app.min.js")),
    appCss: webview.asWebviewUri(vscode.Uri.joinPath(dir, "redux-devtools-app.min.css"))
  };
}
function buildPanelHtml(webview, assets, port) {
  const cspSource = webview.cspSource;
  const csp = [
    `default-src 'none'`,
    `style-src ${cspSource} 'unsafe-inline'`,
    `script-src ${cspSource} 'unsafe-inline'`,
    `connect-src ws://127.0.0.1:* ws://localhost:* http://127.0.0.1:* http://localhost:*`,
    `font-src ${cspSource} data:`,
    `img-src ${cspSource} data:`
  ].join("; ");
  return (
    /* html */
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}" />
    <title>Redux DevTools</title>
    <link href="${assets.appCss}" rel="stylesheet" />
    <style>
      html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }
      #root, #root > div { height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="${assets.reactJs}"></script>
    <script src="${assets.reactDomJs}"></script>
    <script src="${assets.appJs}"></script>
    <script>
      const container = document.querySelector('#root');
      const element = React.createElement(ReduxDevToolsApp.Root, {
        socketOptions: {
          hostname: '127.0.0.1',
          port: ${port},
          autoReconnect: true,
        },
      });
      ReactDOM.createRoot(container).render(element);
    </script>
  </body>
</html>`
  );
}
async function openPanel(context) {
  if (panel) {
    panel.reveal();
    return;
  }
  const webviewDir = path.join(context.extensionPath, "dist", "webview");
  const required = [
    "react.production.min.js",
    "react-dom.production.min.js",
    "redux-devtools-app.min.js",
    "redux-devtools-app.min.css"
  ];
  const missing = required.filter((f) => !fs.existsSync(path.join(webviewDir, f)));
  if (missing.length > 0) {
    vscode.window.showErrorMessage(
      `Redux DevTools: missing bundled assets in dist/webview: ${missing.join(", ")}. Re-run the extension build.`
    );
    return;
  }
  let server;
  try {
    server = await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Starting Redux DevTools server\u2026" },
      async () => await ensureServer()
    );
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to start Redux DevTools: ${err.message}`);
    return;
  }
  panel = vscode.window.createWebviewPanel(
    "vitestReduxDevTools",
    "Redux DevTools",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "dist", "webview")]
    }
  );
  const assets = resolveWebviewAssets(context, panel.webview);
  panel.webview.html = buildPanelHtml(panel.webview, assets, server.port);
  updateStatus(server.port);
  panel.onDidDispose(() => {
    panel = void 0;
    const cfg = vscode.workspace.getConfiguration("vitestReduxDevTools");
    if (cfg.get("shutdownOnPanelClose", false)) {
      void serverPromise?.then((s) => s.dispose());
      serverPromise = void 0;
      statusItem?.hide();
    }
  });
}
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("vitestReduxDevTools.open", () => openPanel(context)),
    vscode.commands.registerCommand("vitestReduxDevTools.copyEnv", async () => {
      const server = await ensureServer();
      const line = `export REDUX_DEVTOOLS_HOST=127.0.0.1 REDUX_DEVTOOLS_PORT=${server.port}`;
      await vscode.env.clipboard.writeText(line);
      vscode.window.showInformationMessage(`Copied: ${line}`);
    })
  );
}
function deactivate() {
  panel?.dispose();
  statusItem?.dispose();
  void serverPromise?.then((s) => s.dispose());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
/*! Bundled license information:

shallow-clone/index.js:
  (*!
   * shallow-clone <https://github.com/jonschlinkert/shallow-clone>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

isobject/index.js:
  (*!
   * isobject <https://github.com/jonschlinkert/isobject>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

is-plain-object/index.js:
  (*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

base64id/lib/base64id.js:
  (*!
   * base64id v0.1.0
   *)
*/
//# sourceMappingURL=extension.js.map
