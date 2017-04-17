function showADPopup() {
    window.open("./popup.html", "_blank", "width=300, height=500, toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=no, left=0, top=0");
}

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.setValue('//Feel free to use TOAST API', 1);
