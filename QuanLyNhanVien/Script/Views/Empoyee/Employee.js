class EmployeePage{
    // Hàm khởi tạo
    constructor(gridId){
        let me = this;

        // Lưu lại grid đang thao tác
        me.grid = $(`#${gridId}`);

        // Dùng khởi tạo sự kiện
        me.initEvents();

        // KHởi tạo form detail
        me.initFormDetail();

        // Lấy ra cấu hình các cột
        me.columnConfig = me.getColumnConfig();

        // Lấy dữ liệu
        me.getData();
    }

    /**
     * Lấy config các cột
     * @returns 
     */
    getColumnConfig(){
        let me = this,
            columnDefault = {
                FieldName: "",
                DataType: "String",
                EnumName: "",
                Text: ""
            },
            columns = [];

        // Duyệt từng cột để vẽ header
        me.grid.find(".col").each(function(){
            let column = {...columnDefault},
                that = $(this);

            Object.keys(columnDefault).filter(function(proName){
                let value = that.attr(proName);

                if(value){
                    column[proName] = value;
                }

                column.Text = that.text();
            });

            columns.push(column)
        });

        return columns;
    }

    /**
     * Dùng để khởi tạo các sự kiện cho trang 
     * NTXUAN (01.07.2022)
     */
    initEvents(){
        let me = this;

        // Khở tạo sự kiện cho toolbar
        me.initEventsToolbar();

        // Khởi tạo sự kiện cho table
        me.initEventsTable();
    }

    /**
     * Khởi tạo sự kiện cho toolbar
     */
    initEventsToolbar(){
        let me = this,
            toolbarId = me.grid.attr("Toolbar");

        // Khởi tạo sự kiện cho các button trên toolbar
        $(`#${toolbarId} [CommandType]`).off("click");
        $(`#${toolbarId} [CommandType]`).on("click", function(){
            let commandType = $(this).attr("CommandType");

            // Gọi đến hàm động cách 2
            if(me[commandType] && typeof me[commandType] == "function"){
                me[commandType]();
            }

            // Cách 1
            // switch(commandType){
            //     case Resource.CommandType.Add:
            //         me.add();
            //         break;
            //     case Resource.CommandType.Edit:
            //         me.edit();
            //         break;
            //     case Resource.CommandType.Delete:
            //         me.delete();
            //         break;
            //     case Resource.CommandType.Export:
            //         if(me.export && typeof me.export == "function"){
            //             me.export();
            //         }
            //         break;
            //     // Todo
            // }
        });
    }

    /**
     * THêm mới
     */
    add(){
        debugger
        let me = this,
            param = {
                parent: me,
                formMode: Enumeration.FormMode.Add
            };

        // Kiểm tra có form detail chưa
        if(me.formDetail){
            me.formDetail.open(param);
        }
    }

    /**
     * Sửa
     */
    edit(){
        debugger
    }

    /**
     * Xóa
     */
    delete(){
        debugger
    }

    /**
     * Khởi tạo trang detail
     * NTXUAN (04.07.2022)
     */
     initFormDetail(){
        let me = this;

        // Khởi tạo đối tượng form detail
        me.formDetail = new EmployeeDetail("EmployeeDetail");
    }

    /**
     * Khởi tạo sự kiện cho table
     */
    initEventsTable(){
        let me = this;

        // Khởi tạo sự kiện khi click vào dòng
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

        //me.grid.html(table);

        // me.grid.empty();
        // me.grid.append(table);

        me.grid.find("table").remove();
        me.grid.append(table);
    }

    /**
     * Reder header
     */
    renderThead(){
        let me = this,
            thead = $("<thead></thead>"),
            tr = $("<tr></tr>");

        // Duyệt từng cột để vẽ header
        // me.grid.find(".col").each(function(){
        //     let text = $(this).text(),
        //         dataType = $(this).attr("DataType"),
        //         className = me.getClassFormat(dataType),
        //         th = $("<th></th>");

        //     th.text(text);
        //     th.addClass(className);

        //     tr.append(th);
        // });

        me.columnConfig.filter(function(column){
            let text = column.Text,
            dataType = column.DataType,
            className = me.getClassFormat(dataType),
            th = $("<th></th>");

            th.text(text);
            th.addClass(className);

            tr.append(th);
        })

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

                tr.data("Xuan", item);

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