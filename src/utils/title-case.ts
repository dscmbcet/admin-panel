export default function titleCase(str: string) {
    return str
      .split(" ")
      .map(function (val) {
        return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
      })
      .join(" ");
  }
