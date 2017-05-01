/*! index.js 06-04-2017 */
/*
$(document).ready(function(){document.addEventListener("click",function(a){a=a||window.event;var b=a.target||a.srcElement;if(a.preventDefault(),b.hasAttribute("data-toggle")&&"modal"==b.getAttribute("data-toggle")&&b.hasAttribute("data-target")){var c=b.getAttribute("data-target");document.getElementById(c).classList.add("open")}if(b.hasAttribute("data-dismiss")&&"modal"==b.getAttribute("data-dismiss")||b.classList.contains("modal")){document.querySelector('[class="modal open"]').classList.remove("open")}},!1)});

 */

$(document).ready(function() {

    document.addEventListener('click', function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;

        e.preventDefault();

        if (target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') == 'modal') {
            if (target.hasAttribute('data-target')) {
                var m_ID = target.getAttribute('data-target');
                document.getElementById(m_ID).classList.add('open');
            }
        }

        // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
        if ((target.hasAttribute('data-dismiss') && target.getAttribute('data-dismiss') == 'modal') || target.classList.contains('modal')) {
            var modal = document.querySelector('[class="modal open"]');

            modal.classList.remove('open');

        }
    }, false);
});