
document.addEventListener("DOMContentLoaded", function() {
  let shown = false;
  document.addEventListener("mouseleave", function(e) {
    if (!shown && e.clientY < 50) {
      alert("Wait! Before you go, grab your free checklist.");
      shown = true;
    }
  });

  let sticky = document.createElement("div");
  sticky.innerHTML = '<a href="https://calendly.com/executivecall/30min" style="background:#007bff;color:#fff;padding:10px 20px;border-radius:20px;position:fixed;bottom:20px;right:20px;z-index:9999;text-decoration:none;">📞 Book My Free Call</a>';
  document.body.appendChild(sticky);
});
