"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mainURL = _axios["default"].create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://fragranta-server-api.vercel.app"
});

var _default = mainURL;
exports["default"] = _default;