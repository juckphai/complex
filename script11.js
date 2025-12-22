    function openSelectedSite() {
      const url = document.getElementById("siteSelector").value;
      if (url) {
        window.open(url, "_blank");
      } else {
        alert("กรุณาเลือกเว็บไซต์ก่อน");
      }
    }