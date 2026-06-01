const pages = {
  "Billing": "/pages/empty_billing_page.html",
  "Inventory": "/pages/inventory.html",
  "Item Request": "/pages/item_request_list_page.html",
  "Sales Report": "/pages/sales_report.html",
  
};

document.querySelectorAll(".menu-item").forEach(item => {
  item.onclick = () => {
    const name = item.querySelector("span").innerText.trim();
    location.href = pages[name];
  };
});