
// Check_In   需取得目前時間today time

function Chick_in(){
    var input_card_number = document.getElementById("checkInNumber").value;
    $('#checkInNumber').attr('disabled',true);
    $('#checkInNumber').val("報到中~");
    $.get("https://script.google.com/macros/s/AKfycbzuR156rkxK9Vv7OuzQ9-ImBWCkz7HSOlWdeIXjvLsfS5iilQw/exec", {
                "card_number":parseInt(input_card_number),
                "today":today,
                "time":time
            },
            function(input){
                var data = input.split(',');
                display_message(data);

                if(data[0] == '2' && confirm("請問需要新增簽到日期表格嗎?") == true){
                    $.get("https://script.google.com/macros/s/AKfycbyiw2c1VtSMXY7ftGX8vPrYEoW97a3RoJKGaavA1Our_bzxoTBS/exec",{
                        "today":today
                        },
                    function(input){
                        var data = input.split(',');
                        display_message(data);
                    });
                }

                $('#checkInNumber').attr('disabled',false);    
                $('#checkInNumber').val("");
                $('#checkInNumber').focus();

            });
}

$('#checkInNumber').keydown(function(event){
    if( event.which == 13 ) {
        Chick_in();
    }
});


function display_message(data){
    var result = "<strong>系統訊息：</strong>";
    result += data[1];
    var result_data = $("<dir></dir>").html(result);
    console.log(data);
    if(data[0]=='0'){//成功(綠色訊息)
        result_data.addClass("alert alert-success");
    } else if(data[0] == '1'){ //通知(藍色訊息)
        result_data.addClass("alert alert-info");
    }else{//警告(紅色訊息)
        result_data.addClass("alert alert-danger");
    }
    $("#result").after(result_data);
}


// 讀取所有報到資訊
var data;
var col,row;
function update_data(){
    $.get("https://script.google.com/macros/s/AKfycbxcu02-G4ZDRJYuPOIu5SU2v5J-ZqLLX0aZvVysE9oI1WeLCpov/exec", {},
            function (input) {
                data = input.split(',');

                for(i=0 ; i<=data.length;i++){
                    if(data[i] == '1'){
                        col = i;//因陣列初始為0，但收尋到ID = 1 以為第二筆資料，固剛好抵銷 ( +1 -1)
                        break;
                    }
                }
                if(col == null){
                    alert('讀取資料錯誤');
                    return;
                }
                row = data.length/col;
                update_display_data();
            });
}   

function update_display_data(){
    var head_item = "";
    for(i =0;i<col;i++){
        head_item += "<td>";
        head_item += data[i];
        head_item += "</td>";
    }
    var head_data = $("<tr></tr>").html(head_item); 
    $('#table_head').append(head_data);


    for(i = 1;i<row;i++){
        var body_item = "";
        for(j=0;j<col;j++){
            if( data[i*col+j] == '已報到'){
                className = 'alert alert-success';
            }
            else if (data[i*col+j] == '未報到') {
                className = 'alert alert-danger';
            }else{
                className = '';
            }
            body_item += "<td class = '" +className + "'>" + data[i*col+j] + "</td>";
        }
        var body_data = $("<tr></tr>").html(body_item); 
        $('#table_body').append(body_data);
    }
}

//  時間更新   取id = now_time
var d = new Date();
var today;
var time;

function update_time(){
    d = new Date(); 
    today = get_today(d);
    time = get_time(d);
    $('#now_time').text(today + ' ' +  time);
    setTimeout("update_time()",1000);
}


function get_today(d){
    var day = d.getDate();
    var year =  d.getFullYear();
    var month = d.getMonth()+1; 
    return year + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day;
}

function get_time(d){
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    return (hour<10 ? '0' : '') + hour + ':' + (minute<10 ? '0' : '') + minute + ':' + (second<10 ? '0' : '') + second;
}

