(function(window) {

//
// executes a SQL against a database
//
function executeSQL(db, sql, out) {
    out.empty();
    try {
        var results = db.exec(sql);
        window.results = results;
        if($.isArray(results)) {
            for(var i in results) {
                var result = results[i];
                renderTable(out, result);
            }
        }
        else if($.isPlainObject(results)) {
            renderTable(out, results);
        } else {
            console.debug(results);
        }
    } catch(e) {
        out.append($("<pre>")
                .addClass("err")
                .text(e.message));
    }
}

function renderTable(out, result) {
    console.debug("render", result);
    var table = $("<table>").addClass("sql-result");

    // create the table header
    var thead = $("<thead>");
    var row = $("<tr>");
    result.columns.forEach(function(name, i) {
        row.append($("<td>").text(name));
    });
    thead.append(row);
    table.append(thead);

    // create the table body
    var tbody = $("<tbody>");
    result.values.forEach(function(tuple, i) {
        var row = $("<tr>");
        tuple.forEach(function(val, j) {
            row.append($("<td>").text(val));
        });
        tbody.append(row);
    });
    table.append(tbody);

    out.append(table);
}

// load the database from an existing sqlite3 file

function asyncLoadDb(url) {
    var deferred = $.Deferred();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        var array = new Uint8Array(this.response);
        var db = new SQL.Database(array);
        deferred.resolve(db);
    };
    xhr.send();

    return deferred;
}

window.executeSQL = executeSQL;
window.asyncLoadDb = asyncLoadDb;

})(window);
