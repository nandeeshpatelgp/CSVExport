/*
 * File:            CSVExport.js
 * Version:         1.0.0-dev
 * Description:     Exports any HTML tablular data into a Comma Separated Values(CSV) file.
 * Author:          Nandeesh Patel G P
 * Created:         Wed Dec 28 15:45:45 IST 2016
 * Modified:        $Date$ by $Author$
 * Language:        Javascript
 * Project:         DataTables
 * Prerequisites:   jQuery
 * Usage:           $table.csvexport({
                        fileName : << name of the CSV file >>       // Optional
                    });
 * Examples:        
 */
 
!function( $ ) {

	var CSVExport = function(element, options){
		this.element = $(element);
		$table = $(element);
		var fileName = options.fileName;
        var colLength = $table.find("tr th").length;
        var rowLength = $table.find("tr").length;
        var data = [];
        for(i=0;i<rowLength;i++) {
            var rowData = [];
            for(j=0;j<colLength;j++) {
                rowData.push("");
            }
            data.push(rowData);
        }
        var i = 0;
        $.each($table.find("tr"),function(rowIndex,row){
            var j = 0;
            $.each($(row).find("td,th"),function(colIndex,column){
                var rowspan = $(column).attr("rowspan") ? parseInt($(column).attr("rowspan")) : 0;
                var colspan = $(column).attr("colspan") ? parseInt($(column).attr("colspan")) : 0;
                if(data[i][j] === ""){
                    var a = i;
                    var b = j;
                    var tempColspan = colspan;
                    while(tempColspan > 0) {
                        data[a][b] = undefined;
                        b = b + 1;
                        tempColspan = tempColspan - 1;
                    }
                    b = j;
                    var tempRowspan = rowspan;
                    while(tempRowspan > 0) {
                        data[a][b] = undefined;
                        tempRowspan = tempRowspan - 1;
                        a = a + 1;
                    }
                    a = i;
                    while(rowspan > 0) {
                        tempColspan = colspan;
                        b = j;
                        while(tempColspan > 0) {
                            data[a][b] = undefined;
                            b = b + 1;
                            tempColspan = tempColspan - 1;
                        }
                        a = a + 1;
                        rowspan = rowspan - 1;
                    }
                }else {
                    while(data[i][j] === undefined) {
                        j = j + 1;
                    }
                }
                data[i][j] = $(column).text();
                j = j + 1;
            });
            i = i + 1;
        });
        var csvContent = "";
        for(i=0; i<data.length ; i++) {
            rowData = ""
            for(j = 0 ; j < data[i].length ;j++) {
                rowData =  rowData + (data[i][j] ? '"' + data[i][j] + '"' : '""') + ',';
            }
            csvContent = csvContent + rowData + "\n" ;
        }
        var encodedUri = "data:text/csv;charset=utf-8,"+encodeURIComponent(csvContent);
        var link = $('<a href="#" class="download-csv" download="' + fileName + '.csv">Export CSV</a>').insertAfter($table);
        if (navigator.userAgent.search("Trident") >= 0) {
			$(link).on("click",function(e){
				e.preventDefault();
				var csvData = 'sep=,\r\n' + csvContent;
				var newWindow = window.open();
				newWindow.document.write(csvData);
				newWindow.document.body.innerHTML = "";
				newWindow.document.close();
				newWindow.document.execCommand('SaveAs', true, fileName + '.csv');
				newWindow.close();
			});
		}else{
			$(link).attr("href",encodedUri);
		}
	};
	
	$.fn.csvexport = function ( option, val ) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('csvexport'),
				options = typeof option === 'object' && option;
			if (!data) {
				$this.data('csvexport', (data = new CSVExport(this, $.extend({}, $.fn.csvexport.defaults,options))));
			}
			if (typeof option === 'string') data[option](val);
		});
	};
	$.fn.csvexport.defaults = {
		fileName : "Table" // Name of the CSV file without extension .csv
	};
	
	$.fn.csvexport.Constructor = CSVExport;
}( window.jQuery );