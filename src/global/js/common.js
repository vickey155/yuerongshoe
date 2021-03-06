
;(function($){
    var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click', _on = $.fn.on;
    if(!$.fn.onClick) {
        $.fn.onClick = function () {
            arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
            return _on.apply(this, arguments);
        };
    }
    $(document).on('change','select',function () {
        var self = $(this);
        var selectedVal = $.trim(self.find("option:selected").val());
        if(selectedVal === '' && self.hasClass('selected')){
            self.removeClass('selected');
        }
        else if(selectedVal != '' && !self.hasClass('selected')){
            self.addClass('selected');
        }
    });
})(jQuery);

//阻止浏览器的默认行为
function stopDefault( e ) {
    //阻止默认浏览器动作(W3C)
    if ( e && e.preventDefault )
        e.preventDefault();
    //IE中阻止函数器默认动作的方式
    else
        window.event.returnValue = false;
    return false;
}

var commonEvent = function() {
    var valTurnTwoNum = function(val){
        var returnVal = '0.00';
        if(val == null){
            returnVal = '0.00';
        }
        else{
            var selVal = $.trim(val.toString());
            if(selVal == ''){
                returnVal = '0.00';
            }
            else{
                if(selVal.indexOf('.') == -1){   //整数
                    returnVal = selVal+".00";
                }
                else{
                    var arrNum = selVal.split(".");
                    var pointNum = arrNum[1];
                    if(pointNum.length == 1){ //一位小数
                        returnVal = selVal +'0';
                    }
                    else if(pointNum.length == 2){ //两位小数
                        returnVal = selVal;
                    }
                    else{     //两位以上小数
                        arrNum[1] = pointNum.substring(0,2);
                        returnVal = arrNum.join('.');
                    }
                }
            }
        }
        return returnVal;
    };
    var closeDialog = function(){
        $('.dialog-alert-pop').onClick('click', '.close-btn', function () {
            $(".bg-alert-pop").remove();
            $(".dialog-alert-pop").remove();
            return false;
        });
    };
    var dialogErrTip = function (errTip) {
        var temp = '<div class="bg-alert-pop"></div><div class="dialog-alert-pop">' +
            '<div class="dialog-title"> 温馨提示</div><div class="dialog-cont">' +
            '<p>' + errTip + '</p></div>' +
            '<div class="dialog-btn"><a class="a-btn-redbg close-btn">确认</a>' +
            '</div> </div>';
        $('body').append(temp);
    };
    var dialogFillNone = function (errTip) {
        var temp = '<div class="bg-alert-pop"></div><div class="dialog-alert-pop">' +
            '<div class="dialog-title"> 温馨提示</div><div class="dialog-cont">' +
            '<p>对不起，'+errTip+'</span></p></div>' +
            '<div class="dialog-btn"><a class="a-btn-redbg close-btn">确认</a>' +
            '</div> </div>';
        $('body').append(temp);
    };
    var dialogInput = function (formObj,errTip) {
        var temp = '<div class="bg-alert-pop"></div><div class="dialog-alert-pop">' +
            '<div class="dialog-title"> 温馨提示</div><div class="dialog-cont">' +
            '<input type="text" placeholder="'+errTip+'"/></div>' +
            '<div class="dialog-btn a-2"><a class="a-btn-graybg close-btn">取消</a><a class="a-btn-redbg sure-btn">确认</a>' +
            '</div> </div>';
        $('body').append(temp);
        $('.dialog-alert-pop .sure-btn').onClick('click', function () {
            var inputObj = $(".dialog-alert-pop input");
            var inputVal = $.trim(inputObj.val());
            if( inputVal == ''){
                inputObj.addClass("input-error");
            }
            else{
                var temp='<div class="checkbox-wrap"><span class="a-tab">'+inputVal +'<i class="icon-close"></i></span><input type="checkbox" name="'+inputVal +'"/></div>'
                inputObj.removeClass("input-error");
                formObj.before(temp);
                $(".bg-alert-pop").remove();
                $(".dialog-alert-pop").remove();
                $(".a-tab-wrap .icon-close").onClick('click',function(e){
                  var sel = $(this);
                  //sel.closest('.checkbox-wrap').find('input[type=checkbox]').prop("checked", false);
                  sel.closest('.checkbox-wrap').remove();
                  stopDefault(e);
                })
            }

        });
    };
    var dialogConfirm = function (errTip,fun) {
        var temp = '<div class="bg-alert-pop"></div><div class="dialog-alert-pop">' +
            '<div class="dialog-title"> 温馨提示</div><div class="dialog-cont">' +
            '<p>' + errTip + '</p></div>' +
            '<div class="dialog-btn a-2"><a class="a-btn-graybg close-btn">取消</a><a class="a-btn-redbg sure-btn">确认</a>' +
            '</div> </div>';
        $('body').append(temp);
       // closeDialog();
      $('.dialog-alert-pop .sure-btn').onClick('click',function(){
        $(".bg-alert-pop").remove();
        $(".dialog-alert-pop").remove();
        fun();
        return false;
      });
    };
    var confirmSureFun = function(fun){
        $('body').onClick('click','.dialog-alert-pop .sure-btn',function(){
            fun();
            $(".bg-alert-pop").remove();
            $(".dialog-alert-pop").remove();
            return false;
        });
    };
    var checkboxChecked = function(){
        $("body").onClick("click","input.input-cbox", function () {
            var self = $(this);
            if (self.hasClass('icon-ok')) {
                self.removeClass('icon-ok').attr('checked',false);
            }
            else {
                self.addClass('icon-ok').attr('checked',true);
            }
        });
    };
    var addAndCut = function(fun){
        //加减
        $("body").on('keyup',".opts-wrap input",function (e) {
            var sel = $(this);
            var selVal =  Number($.trim(sel.val()));
            var defaultval = Number(sel.data('defaultval'));
            if(selVal <= defaultval){
                sel.val(defaultval);
                return false;
            }
            else{
                var selVla =parseInt(selVal);
                sel.val(selVla);
            }
            //stopDefault(e);
        });
        $("body").on('blur',".opts-wrap input",function (e) {
            fun($(this));
        });
        $("body").on('click','.opts-wrap a',function (e) {
            var selInd = $(this).index();
            var input = $(this).parent('.opts-wrap').find("input");
            input.trigger('blur');
            var num = Number(input.val());
            var defaultval = Number(input.data('defaultval'));
            if(selInd == 0){  // -
                if(num <= defaultval){
                    num = defaultval;
                    return false;
                }
                else{
                    num--;
                }
            }
            else if(selInd == 2){  // +
                num++;
            }
            input.val(num);
            fun($(this));
            stopDefault(e);
        });
    };
    var circleChoose = function(pram){
        var txt = pram.tip;
        var num = 0;
        var chooseList = $('#choose-list');
        var circleObj = chooseList.find('.circle-choose');
        //单选
        chooseList.onClick('click','.circle-choose span',function(){
            var sel = $(this);
            var chooseAll = sel.closest('body').find('#all-choose');
            circleObj = chooseList.find('.circle-choose');
            var circleLen = circleObj.length;
           if(sel.hasClass('active')){
               sel.removeClass('active');
               num--;
               if(num != circleLen){
                   chooseAll.find('span').removeClass('active');
               }
           }
           else{
               sel.addClass('active');
               num++;
               if(num == circleLen){
                   chooseAll.find('span').addClass('active');
               }
           }
       });
        //全选
        $("#all-choose").onClick('click',"span",function(){
            var sel = $(this);
            circleObj = chooseList.find('.circle-choose');
            var circleLen = circleObj.length;
            if(sel.hasClass('active')){
                sel.removeClass('active');
                chooseList.find('.circle-choose span').removeClass('active');
                num = 0;
            }
            else{
                sel.addClass('active');
                chooseList.find('.circle-choose span').addClass('active');
                num = circleLen;
            }
        });
        //显示没有列表的样式
        var showListNone = function(){
            $("#all-choose").find('span').removeClass('active');
            var circleLen0 = chooseList.find('.circle-choose').length;
            if(circleLen0<=0 && $(".sec-list-none")[0]){
                $(".sec-list-none").show();
                $(".sec-list-none").next('div').hide();
            }
            else{
                $(".sec-list-none").hide();
                $(".sec-list-none").next('div').show();
            }
        }
        var sureFun = function () {
            circleObj = chooseList.find('.circle-choose');
            var circleLen = circleObj.length;
            var idsArr = [];
            for(var i=0;i<circleLen;i++){
                var span = circleObj.eq(i).find('span');
                if(span.hasClass('active')){
                    var selLiId = span.closest('li').attr('id');
                    idsArr.push(selLiId);
                   // span.closest('li').remove();
                    //num--;
                }
            }
            var idsStr = idsArr.join(',');

            $.ajax({
                type: "POST",
                url: pram.url,
                data: {
                    ids: idsStr
                },
                success: function (result) {
                    if(result.status == 'ok'){
                        for(var i=0;i<idsArr.length;i++){
                            chooseList.find('li[id='+idsArr[i]+']').remove();
                            num--;
                        }
                        showListNone();
                    }
                    else{
                        dialogFillNone('删除出错，请稍后再试');
                        closeDialog();
                    }
                },
                error: function () {
                    dialogFillNone('系统繁忙，请稍后再试');
                    closeDialog();
                }
            });
        }
        //删除
        $(".fixed-footer").onClick('click','.delete-btn',function(){
            if(num <= 0){
                var tip="您没有选择所要删除的"+txt;
                dialogErrTip(tip);
                closeDialog();
            }
             else{
                var tip="您确定要删除所选定的"+txt+"吗";
                dialogConfirm(tip,function(){
                    sureFun();
                });
                closeDialog();
            }
        });

    };
    return{
        valPointTwoNum:function(val){
            return valTurnTwoNum(val);
        },
        initFun:function(){
            checkboxChecked();
        },
        addAndCutFun:function (fun) {
            addAndCut(fun);
        },
        chooseCircle:function (txt) {
            circleChoose(txt);
        },
        validataDialog:function (errTip) {
            dialogErrTip(errTip);
            closeDialog();
        },
        inputTextNone:function (errTip) {
            dialogFillNone(errTip);
            closeDialog();
        },
        confirmDialog:function(tip,fun){ //fun为确认时执行的函数方法
            dialogConfirm(tip,fun);
            closeDialog();
        },
        customizeDialog:function (obj,errTip) {
            dialogInput(obj,errTip);
            closeDialog();
        },
        alertDialog:function(tip){ //alert提示框
            dialogErrTip(tip);
            closeDialog();
        },
    }
}();

$(function () {
    //checkbox
    //登录页面记住密码
     commonEvent.initFun();



})







