/**
 * Created by harshilkumar on 4/25/17.
 */
$(function () {
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


    getallGuestData();
    function getallGuestData() {

        var guestData = {};
        $.ajax({
            url: 'http://localhost:3000/getguestJson',
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
            url: 'http://localhost:3000/sendemails',
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