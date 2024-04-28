import moment from "moment";
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { keyframes } from "@emotion/react";

export const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
export const fadeInLeft = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateX(50px);
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
`;
export const fadeInRight = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateX(-50px);
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
`;
export const LoadingSkeleton = ({ width = 100 }) => {
  return (
    <Skeleton baseColor="#352d64" highlightColor="#4c407b" width={width + 'px'} />
  );
}


export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function isMobile() {
  if (window) {
    return window.matchMedia(`(max-width: 1024px)`).matches;
  }
  return false;
}

export function isMdScreen() {
  if (window) {
    return window.matchMedia(`(max-width: 1199px)`).matches;
  }
  return false;
}

function currentYPosition() {
  if (!window) {
    return;
  }
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  var elm = document.getElementById(elmID);
  if (!elmID || !elm) {
    return;
  }
  var startY = currentYPosition();
  var stopY = elmYPosition(elm);
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export const parseErrorMsg = (errMsg) => {
  var returStr = "";
  let startPos = JSON.stringify(errMsg).search("message");
  if (startPos >= 0) {
    let subStr = errMsg.substring(startPos + 4, errMsg.length)
    let endPos = subStr.indexOf("\"");
    if (endPos >= 0) {
      subStr = subStr.substring(0, endPos);
      returStr = subStr;
    }
  } else returStr = errMsg;
  return returStr;
}

export function getTimeDifference(date) {
  let difference =
    moment(new Date(), "DD/MM/YYYY HH:mm:ss").diff(
      moment(date, "DD/MM/YYYY HH:mm:ss")
    ) / 1000;

  if (difference < 60) return `${Math.floor(difference)} seconds`;
  else if (difference < 3600) return `${Math.floor(difference / 60)} minutes`;
  else if (difference < 86400) return `${Math.floor(difference / 3660)} hours`;
  else if (difference < 86400 * 30)
    return `${Math.floor(difference / 86400)} days`;
  else if (difference < 86400 * 30 * 12)
    return `${Math.floor(difference / 86400 / 30)} months`;
  else return `${(difference / 86400 / 30 / 12).toFixed(1)} years`;
}

export function sec2str(secs) {
  const days = Math.floor(secs / 86400);
  const hours = Math.floor(secs / 3600) % 24;
  const minuts = Math.floor(secs / 60) % 60;
  // const sec = secs % 60;
  if (secs <= 0) 
    return '';
  return `${days.toString().padStart(2, "0")}D:${hours.toString().padStart(2, "0")}H:${minuts.toString().padStart(2, "0")}M`;
}

export function getUTCNow() {
  return Date.now();
  // var date = new Date();
  // var now_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
  // return now_utc.getTime();
}

export function getUTCTimestamp(_date) {
  var date = new Date(_date);
  var date_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
  return date_utc.getTime();
}

export function getDeadlineTimestamp(start_time, duration) {
  const date = new Date(parseInt(start_time));
  const date_utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  const start_utc = date_utc.getTime();
  if (duration > 3650)
    duration = 3650;
  return start_utc + duration * 24 * 3600 * 1000;
}

export function getTime(date) {
  return (date * 24 * 3600 * 1000).toString();
}

export function getUTCDate(timestamp) {
  const num_time = parseInt(timestamp) * 1000;
  const date = new Date(num_time);
  return moment.utc(date).format("MMMM Do, HH:mm UTC");
}

export function getUTCDateTime(timestamp) {
  const time = parseInt(timestamp);
  const date = new Date(time);
  return moment.utc(date).format();
}

export function validationStartTime(start_time) {
  const start_date = new Date(parseInt(start_time));
  const now_date = new Date();
  let difference =
    moment(start_date, "DD/MM/YYYY HH:mm:ss").diff(
      moment(now_date, "DD/MM/YYYY HH:mm:ss")
    ) / 1000;

  if (difference > -86400)
    return true;
  else
    return false;
}

export function generateRandomId() {
  let tempId = Math.random().toString();
  let uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  var params = {};
  var search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf("?") + 1)
  );
  var definitions = search.split("&");
  definitions.forEach(function (val, key) {
    var parts = val.split("=", 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(" ");
}

export const numberWithCommas = (x, digits = 3) => {
  return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  customClass: {
    popup: 'colored-toast'
  },
  showConfirmButton: false,
  color: 'black',
  timer: 400000,
  timerProgressBar: true,
})

export const getCoinName = (chainId) => {
  if (chainId === 0 || chainId === 97) // BSC testnet
    return 'AVAX';
  else if (chainId === 1)
    return 'MATIC';
  else
    return 'BNB';
}

export const countDecimals = (number) => {
  var text = number.toString();
  var data = text.split('.');
  var numberPart = 0, fractionalPart = 0;
  if (data.length === 2) {
    numberPart = data[0].length;
    fractionalPart = data[1].length;
  } else {
    numberPart = data[0].length;
    fractionalPart = 0;
  }
  return {
    numberPart,
    fractionalPart
  }
}