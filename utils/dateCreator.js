class DateCreator {
  static add24hours(date) {
    return date.setHours(date.getHours() + 24);
  }

  static add7days(date) {
    return date.setDays(date.getDays() + 7);
  }

  static add14days(date) {
    return date.setDays(date.getDays() + 14);
  }

  static add1months(date) {
    return date.setMonth(date.getMonth() + 1);
  }

  static add6months(date) {
    return date.setMonth(date.getMonth() + 6);
  }
}

module.exports = DateCreator;
