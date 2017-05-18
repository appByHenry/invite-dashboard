/**
 * Created by harshilkumar on 5/7/17.
 */

/**
 * Created by harshilkumar on 4/25/17.
 */
$(function () {

    getallGuestData();
    getAllinviteEmail();
    var allguestEmail = {};
    function getAllinviteEmail() {
        $.ajax({
            url: 'https://wd-app-db.herokuapp.com/getEmail',
            contentType: "application/json; charset=utf-8",
            type: 'GET',
            crossDomain: true,
            success: function(data){
                for(var i=0; i<data.length; i++)
                {
                    var mailData = data[i].Emailsdata;
                    $.each(mailData, function(index, element) {
                        console.log("email key", index);
                        console.log("email value", element);
                        var each_mail_html = '<div class="each_single_email">'+element+'</div>';
                        $('.sent_email_list').append(each_mail_html);
                        allguestEmail[index] = element;
                    });

                }

                console.log("Get the email data from mongo",allguestEmail);
                //return allguestEmail;


            },
            complete: function () {
                //called when complete
                console.log('get all emails is completed.');
            },
            error: function () {
                // Data not found in json want to offer for new user.
                console.log("Error while get all guest emails");
            },
        });
    }
    function getallGuestData() {

        var pooja_cermony = 0;
        var wedding_ceremony = 0;

        var pooja_cermony_child = 0;
        var wedding_ceremony_child = 0;

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

                    var wedCer = element.g_data.wed_cer;
                    var pooja_cer = element.g_data.j_cer;


                    element.g_data.h_cer;
                    var wd_wishes = element.g_data.wishes;
                    var no_of_people = element.g_data.no_ppl;
                    var no_of_people_int = parseInt(no_of_people);

                    var no_of_children = element.g_data.no_chldrn;
                    var no_of_child_int = parseInt(no_of_children);

                    if(wedCer == "Y")
                    {
                        wedding_ceremony = wedding_ceremony+no_of_people_int;
                        wedding_ceremony_child = wedding_ceremony_child+no_of_child_int;
                    }
                    if(pooja_cer == "Y")
                    {
                        pooja_cermony = pooja_cermony+no_of_people_int;
                        pooja_cermony_child = pooja_cermony_child+no_of_child_int;
                    }

                    if(wd_wishes != "NA")
                    {
                        var each_wish = '<div class="wd_wish_style"><div class="whiser_name">* '+element.g_data.name+' *</div><div>'+wd_wishes+'</div></div>';
                        $('#wd_wishes').append(each_wish);

                    }

                    var each_row = '<tr class="table_data_row">'+
                        '<td  style="width:300px;">'+decodedEmail+'</td><td  style="width:150px;">'+element.g_data.name+'</td><td>'+element.g_data.wed_cer+'</td>' +
                        '<td>'+element.g_data.j_cer+'</td><td>'+element.g_data.no_ppl+'</td><td>'+element.g_data.no_chldrn+'</td>'+
                        '</tr>';
                    $('.guest_list_table').append(each_row);
                });
                $(".wedding_people").text(wedding_ceremony);
                $(".pooja_people").text(pooja_cermony);

                $(".wedding_ceremony_child").text(wedding_ceremony_child);
                $(".pooja_cermony_child").text(pooja_cermony_child);
            },
            complete: function () {
                //called when complete
                console.log('get all data along with email is completed.');
            },
            error: function () {
                // Data not found in json want to offer for new user.
                console.log("Error while get all  data and  guest email");
            },
        });
    }
    $(document).on("click", ".chkbox_container", function () {
        console.log(this);
        $(this).find("i").toggleClass("display_none_class");
        $("#wedding_rsvp").attr("style"," ");
        $(this).siblings().find("i").addClass("display_none_class");
    });

    // For RSVP data
    $(document).on("click", ".collapse-expand-rsvp", function () {
        console.log(this);
        $(".guest_list_details").toggle(400);
        $(this).find("i").toggleClass("fa-chevron-up fa-chevron-down");
    });

    // For sent email invitations data
    $(document).on("click", ".collapse-expand-sent-emails", function () {
        console.log(this);
        $(".sent_email_list").toggle(400);
        $(this).find("i").toggleClass("fa-chevron-up fa-chevron-down");
    });
    function randomstringGen(len)
    {
        var text="";

        var charset = "ABCDEFGHIJKLabcdefghijklMNOPQRSTUVWXYZmnopqrstuvwxyz0123456789";

        for( var i=0; i < len; i++ )
            text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    }

    function storeGuestEmails(updatedEmailArry,whichEvents,gestEmailData) {
        var Dbdata = {"guestmailObject": gestEmailData};
        console.log(Dbdata);
        Dbdata = JSON.stringify(Dbdata);
        $.ajax({
            url: 'https://wd-app-db.herokuapp.com/storemailsObj',
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            crossDomain: true,
            data: Dbdata,
            success: function(data){
                console.log(data);
                // Now call to function send email
                callFunc_to_sendInvite(updatedEmailArry, whichEvents);
            },
            complete: function () {
                //called when complete
                console.log('storing guest email is completed.');
            },
            error: function () {
                // Data not found in json want to offer for new user.
                console.log("Error while storing guest email");
            },
        });
    }
    //console.log(stringGen(3));
    // Resend Email functionality

    $(document).on("click", "#resend_invite", function () {
        var check_ceremony = 0;
        console.log(this);
        var emailString = $('textarea.mail_txt').val();
        var Emailarray;
        var whichEvents = "";
        var gestEmailObj = {};
        $(".invalidmail_list").empty();


        console.log("Reminder option Any one choice is selected");
        if(emailString)
        {
            var countInvalidEmail=0;
            Emailarray = emailString.split(',');
            for(var i=0; i<Emailarray.length; i++)
            {
                Emailarray[i];
                var checkValidEmail = ValidateEmail(Emailarray[i]);
                if(!checkValidEmail)
                {
                    countInvalidEmail++;
                    $(".invalidmail_list").append('<div id="invalid_email_'+i+'">This email id is invalid:> '+Emailarray[i]+'</div>');
                    console.log("This email is not valid", Emailarray[i]);
                }
                else
                {
                    console.log("This email is valid");
                }
            }
            var rejectedEmailArry = [];
            var accepted_count = 0;
            if(countInvalidEmail == 0)
            {
                // email ids are valid..
                var i = 0;

                var interval = setInterval(function() {
                    if (i<Emailarray.length) {
                        console.log("Resend Invite fecting email after 1 minute:", Emailarray[i]);

                        var Dbdata = {"eachMail": Emailarray[i]};
                        console.log(Dbdata);
                        Dbdata = JSON.stringify(Dbdata);
                        $.ajax({
                            url: 'https://wd-app-db.herokuapp.com/resendemails',
                            contentType: "application/json; charset=utf-8",
                            type: 'POST',
                            crossDomain: true,
                            data: Dbdata,
                            success: function(data){
                                console.log(data);
                                var acceptedOrnot = data.accepted.length;
                                if(acceptedOrnot > 0)
                                {
                                    accepted_count++;
                                }
                                var rejected_emailid = data.rejected.length;
                                if(rejected_emailid > 0)
                                {
                                    rejectedEmailArry.push(Emailarray[i]);
                                    console.log("rejeceted email id: ", Emailarray[i]);
                                }


                            },
                            complete: function () {
                                //called when complete
                                console.log('reminder sending email functionality is completed.');
                            },
                            error: function () {
                                // Data not found in json want to offer for new user.
                                console.log("Error while sending email");
                                console.log("rejeceted email id: ", Emailarray[i]);
                            },
                        });

                        i++;
                    }
                    else {
                        clearInterval(interval);
                        console.log("length of email array ", Emailarray.length);
                        console.log("length of accepted count", accepted_count);
                        if(rejectedEmailArry.length > 0)
                        {
                            alert("couple of emailid's are rejeceted. Please look at the console log");
                        }
                        console.log("Clear interval");

                    }
                }, 15000);

            }
            else
            {
                $("#emailNotValid").trigger("click");
            }
        }
        else
        {
            $("#email_text_empty").trigger("click");
        }

    });


    $(document).on("click", "#send_invite", function () {
        var check_ceremony = 0;
        console.log(this);
        var emailString = $('textarea.mail_txt').val();
        var Emailarray;
        var whichEvents = "";
        var gestEmailObj = {};
        $(".invalidmail_list").empty();
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
                var countInvalidEmail=0;
                Emailarray = emailString.split(',');
                for(var i=0; i<Emailarray.length; i++)
                {
                    Emailarray[i];
                    var checkValidEmail = ValidateEmail(Emailarray[i]);
                    if(!checkValidEmail)
                    {
                        countInvalidEmail++;
                        $(".invalidmail_list").append('<div id="invalid_email_'+i+'">This email id is invalid:> '+Emailarray[i]+'</div>');
                        console.log("This email is not valid", Emailarray[i]);
                    }
                    else
                    {
                        console.log("This email is valid");
                    }
                }
                var updatedEmailArry = [];
                if(countInvalidEmail == 0)
                {
                    var email_are_valid = 0;
                    for(var i=0; i<Emailarray.length; i++)
                    {
                        var unqEmailKey = randomstringGen(4);
                        if (Object.values(allguestEmail).indexOf(Emailarray[i]) > -1) {
                            console.log('Object/in mongodb has value', Emailarray[i]);
                        }
                        else
                        {
                            gestEmailObj[unqEmailKey] = Emailarray[i];
                            updatedEmailArry.push(Emailarray[i])
                            email_are_valid++;
                        }
                    }
                    console.log(gestEmailObj);
                    if(email_are_valid > 0)
                    {
                        storeGuestEmails(updatedEmailArry,whichEvents,gestEmailObj);
                    }
                }
                else
                {
                    $("#emailNotValid").trigger("click");
                }
            }
            else
            {
                $("#email_text_empty").trigger("click");
            }
        }
        else {
            $("#email_text_empty").trigger("click");
        }

    });
    function ValidateEmail(email) {
        var expr = /^[\w\-\.\+]+\@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return expr.test(email);
    };
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
                $("#sendEmail").trigger("click");
            },
            complete: function () {
                //called when complete
                console.log('sending email functionality is completed.');
            },
            error: function () {
                // Data not found in json want to offer for new user.
                console.log("Error while sending email");
            },
        });
    }
});