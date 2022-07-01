class EmployeePage{
    // Hàm khởi tạo
    constructor(gridId){
        let me = this;

        // Lưu lại grid đang thao tác
        me.grid = $(`#${gridId}`);

        // Dùng khởi tạo sự kiện
        me.initEvents();
        
        // Lấy dữ liệu
        me.getData();
    }

    /**
     * Dùng để khởi tạo các sự kiện cho trang 
     * NTXUAN (01.07.2022)
     */
    initEvents(){
        let me = this;

        me.grid.off("click", "tr");
        me.grid.on("click","tr", function(){
            me.grid.find(".yellow-tr").removeClass("yellow-tr");

            $(this).addClass("yellow-tr");
        });
    }

    /**
     * Hàm dùng để lấy dữ liệu cho trang
     * NTXUAN (01.07.2022)
     */
    getData(){
        let me = this,
            url = me.grid.attr("Url");

        CommonFn.Ajax(url, Resource.Method.Get, {}, function(response){
            if(response){
                me.loadData(response);
            }else{
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }

    /**
     * Load dữ liệu
     */
    loadData(data){
        let me = this;
        
        if(data){
            // Render dữ liệu cho grid
            me.renderGrid(data);
        }
    }

    /**
     * Render dữ liệu cho grid
     */
    renderGrid(data){
        let me = this,
            table = $("<table></table>"),
            thead = me.renderThead(),
            tbody = me.renderTbody(data);

        table.append(thead);
        table.append(tbody);

        me.grid.html(table);
    }

    /**
     * Reder header
     */
    renderThead(){
        let me = this,
            thead = $("<thead></thead>"),
            tr = $("<tr></tr>");

        // Duyệt từng cột để vẽ header
        me.grid.find(".col").each(function(){
            let text = $(this).text(),
                dataType = $(this).attr("DataType"),
                className = me.getClassFormat(dataType),
                th = $("<th></th>");

            th.text(text);
            th.addClass(className);

            tr.append(th);
        });

        thead.append(tr);

        return thead;
    }

    /**
     * Renderbody
     */
    renderTbody(data){
        let me = this,
            tbody = $("<tbody></tbody>");

        if(data){
            data.filter(function(item){
                let tr = $("<tr></tr>");

                // Duyệt từng cột để vẽ header
                me.grid.find(".col").each(function(){
                    let fieldName = $(this).attr("FieldName"),
                        dataType = $(this).attr("DataType"),
                        td = $("<td></td>"),
                        value = me.getValueCell(item, fieldName, dataType),
                        className = me.getClassFormat(dataType);

                    td.text(value);
                    td.addClass(className);

                    tr.append(td);
                });

                tbody.append(tr);
            });
        }

        return tbody;
    }

     /**
     * Lấy giá trị ô
     * @param {} item 
     * @param {*} fieldName 
     * @param {*} dataType 
     */
      getValueCell(item, fieldName, dataType){
        let me = this,
            value = item[fieldName];

        switch(dataType){
            case Resource.DataTypeColumn.Number:
                value = CommonFn.formatMoney(value);
                break;
            case "Date":
                break;
            case "Enum":
                break;
        }

        return value;
    }

     /**
     * Hàm dùng để lấy class format cho từng kiểu dữ liệu
     * CreatedBy: NTXUAN 06.05.2021
     */
    getClassFormat(dataType){
        let className = "";
    
        switch(dataType){
            case Resource.DataTypeColumn.Number:
                className = "align-right";
                break;
            case Resource.DataTypeColumn.Date:
                className = "align-center";
                break;
        }
    
        return className;
    }
}


// Khởi tạo một biến cho trang nhân viên
var employeePage = new EmployeePage("gridEmployee");