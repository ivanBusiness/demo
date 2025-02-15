import { createCipheriv, createDecipheriv } from "crypto";
import { appConfig } from "../config";

export const countDays = (start, end, exclude = []) => {
  const days = [];
  start = new Date(new Date(start).setHours(0, 0, 0, 0));
  end = new Date(new Date(end).setHours(0, 0, 0, 0));

  for (
    var d = new Date(new Date(start).setHours(0, 0, 0, 0));
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    if (d >= start && !exclude.includes(d.getDay())) {
      days.push(new Date(d));
    }
  }

  return days.length;
};

Array.prototype.swap = function (oldIndex, newIndex) {
  const a = this[oldIndex],
    b = this[newIndex];
  this[newIndex] = a;
  this[oldIndex] = b;
  return this;
};

Number.prototype.pad = function (l) {
  let zeros = "";
  for (let i = 0; i < l; i++) zeros += "0";
  return zeros.length >= `${this}`.length ? (zeros + this).slice(-l) : this;
};
