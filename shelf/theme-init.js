/* Early theme apply for any page that still references this file.
   index.html inlines the same steps so the first paint does not wait on this request. */
(function () {
  try {
    var t = localStorage.getItem("shelf-theme");
    if (t !== "light" && t !== "dark") return;
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = t;
    document.documentElement.setAttribute("data-theme", t);
    var color = t === "dark" ? "#161310" : "#f4efe6";
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (node) {
      node.content = color;
    });
  } catch (e) {}
})();
