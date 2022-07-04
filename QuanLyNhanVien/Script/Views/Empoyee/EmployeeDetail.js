class EmployeeDetail{
    constructor(formId){
        let me = this;

        me.form = $(`#${formId}`);

        // Khởi tạo sự kiện cho form
        me.initEvents();
    }

    /**
     * Khởi tạo sự kiện cho form
     */
    initEvents(){
        let me = this;

        // Khởi tạo sự kiện button trên toolbar dưới form
        me.form.find(".toolbar-form [CommandType]").off("click");
        me.form.find(".toolbar-form [CommandType]").on("click", function(){
            let commandType = $(this).attr("CommandType");

            // Gọi đến hàm động 
            if(me[commandType] && typeof me[commandType] == "function"){
                me[commandType]();
            }
        });
    }

    /**
     * Đóng form
     */
    close(){
        let me = this;

        me.form.hide();
    }

    /**
     * Lưu dữ liệu
     */
    save(){
        debugger
        let me = this,
            isValid = me.validateForm();

        if(isValid){
            let data = me.getFormData();

            // Lưu data
            me.saveData(data);
        }
        debugger
    }

    /**
     * Xử lý validate form
     */
    validateForm(){
        let me = this,
            isValid = me.validateRequire();

        // Require, Email, SĐT, MaxLength, DateTime, Số, ...
        // if(isValid){
        //     isValid = me.validateNumber();
        // }

        // if(isValid){
        //     isValid = me.validateDateTime();
        // }

        // if(isValid){
        //     isValid = me.validateDuplicate();
        // }

        // if(isValid){
        //     isValid = me.validateEmail();
        // }

        // Todo

        // if(isValid){
        //     isValid = me.validateCustom();
        // }

        return isValid;
    }

    /**
     * Validate các trường băt buộc
     */
    validateRequire(){
        let me = this,
            isValid = true;

        me.form.find('[Required]').each(function(){
            let value = $(this).val();

            if(!value){
                isValid = false;

                $(this).addClass("require-control");
                $(this).attr("title", "Không được bỏ trống");
            }else{
                $(this).removeClass("require-control");
                $(this).attr("title", "");
            }
        });

        return isValid;
    }

    /**
     * Lấy dữ liệu form
     */
    getFormData(){
        let me = this,
            data = {};

        me.form.find("[SetField]").each(function(){
            let dataType = $(this).attr("DataType") || "String",
                field = $(this).attr("SetField"),
                value = null;

            switch(dataType){
                case Resource.DataTypeColumn.Enum:
                    //value = me.getValueEnum();
                    break;
                case Resource.DataTypeColumn.String:
                    value = $(this).val();
                    break;
                case Resource.DataTypeColumn.Number:
                    if($(this).val()){
                        value = parseInt($(this).val());
                    }
                    break;
                // Todo
            }

            data[field] = value;
        });

        return data;
    }

    /**
     * xử lý lưu dữ liẹu
     */
    saveData(data){
        let me = this,
            method = Resource.Method.Post,
            url = me.grid.attr("Url");

        // Xử lý lưu vào DB
        if(me.formMode == Enumeration.FormMode.Edit){
            method = Resource.Method.Put;
        }

        CommonFn.Ajax(url, method, data, function(response){
            if(response){
                me.parent.getData();
            }else{
                console.log("Có lỗi");
            }
        });
    }

    /**
     * Hàm mở form
     */
    open(param){
        let me = this;

        Object.assign(me, param);

        // Mở form
        me.form.show();

        // Nếu ở mode thêm thì reset form
        if(param && param.formMode == Enumeration.FormMode.Add){
            me.resetForm();
        }
    }

    /**
     * Reset nội dung form
     */
    resetForm(){
        let me = this;

        me.form.find("[SetField]").each(function(){
            let dataType = $(this).attr("DataType") || "String",
                functionName = "reset" + dataType;

            // Cách 1
            switch(dataType){
                case Resource.DataTypeColumn.Enum:
                    me.resetEnumControl(this);
                    break;
                case Resource.DataTypeColumn.String:
                case Resource.DataTypeColumn.Number:
                    $(this).val("");
                    break;
                // Todo
            }

            // Cách 2
            // Gọi đến hàm động 
            // if(me[functionName] && typeof me[functionName] == "function"){
            //     me[functionName](this);
            // }
        });
    }

    resetEnumControl(control){
        let me =this;

    }

    resetNumber(control){

    }
}
