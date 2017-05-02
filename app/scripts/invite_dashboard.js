/**
 * Created by harshilkumar on 4/25/17.
 */
$(function () {
   
    getallGuestData();
    function getallGuestData() {

        var guestData = {};
        $.ajax({
            url: 'https://wd-app-db.herokuapp.com/getguestJson',
            contentType: "application/json; charset=utf-8",
            type: 'GET',
            crossDomain: true,
            success: function(data){
                console.log(data);
                $.each(data, function(index, element) {
                   console.log(index);
                   console.log(element);
                    var encodedMail = element.g_name;

                    //console.log(encodedMail.replace(/['"]+/g, ''));
                    //var decodedEmail = $.base64.decode('aHJwYXRlbC4yNjNAZ21haWwuY29t');
                    var decodedEmail = $.base64.decode(encodedMail);

                    console.log(decodedEmail);

                    element.g_data.name;

                    element.g_data.wed_cer;
                    element.g_data.j_cer;
                    element.g_data.h_cer;

                    element.g_data.no_ppl;
                    element.g_data.no_chldrn;

                    var each_row = '<tr class="table_data_row">'+
                                                '<td  style="width:300px;">'+decodedEmail+'</td><td  style="width:100px;">'+element.g_data.name+'</td><td>'+element.g_data.wed_cer+'</td>' +
                        '<td>'+element.g_data.j_cer+'</td><td>'+element.g_data.h_cer+'</td><td>'+element.g_data.no_ppl+'</td><td>'+element.g_data.no_chldrn+'</td>'+
                        '</tr>';
                    $('.guest_list_table').append(each_row);
                });
            }
        });
    }
    $(document).on("click", ".chkbox_container", function () {
        console.log(this);
        $(this).find("i").toggleClass("display_none_class");
        $("#wedding_rsvp").attr("style"," ");
        $(this).siblings().find("i").addClass("display_none_class");
    });

    $(document).on("click", "#send_invite", function () {
        var check_ceremony = 0;
        console.log(this);
        var emailString = $('textarea.mail_txt').val();
        var Emailarray;
        var whichEvents = "";
        $(this).parent().prev().find(".chkbox_container").each(function () {
            var var_choice = $(this).find("i");

            if ( var_choice.hasClass( "display_none_class" ) ) {

            }
            else
            {
                whichEvents = var_choice.data('ceremony');
                check_ceremony++;
            }


        });
        if(check_ceremony > 0)
        {
            console.log("Any one choice is selected");
            if(emailString)
            {
                Emailarray = emailString.split(',');
                callFunc_to_sendInvite(Emailarray, whichEvents);
            }
            else
            {
                //alert("Textarea is empty");
                $("#email_text_empty").trigger("click");
            }
        }
        else {
            $("#email_text_empty").trigger("click");
        }

    });
    function callFunc_to_sendInvite(emailArray, kindofEvent){
        if(kindofEvent == "onlyWedding")
        {
            kindofEvent = "2-page-invite";
        }
        else if(kindofEvent == "Weddingplus")
        {
            kindofEvent = "multi-page-invite";
        }
        var Dbdata = {"mailAry": emailArray, "eventKind": kindofEvent};
        console.log(Dbdata);
        Dbdata = JSON.stringify(Dbdata);
        $.ajax({
            url: 'https://wd-app-db.herokuapp.com/sendemails',
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            crossDomain: true,
            data: Dbdata,
            success: function(data){
                console.log(data);
            }
        });
    }
});