const params = new URLSearchParams(window.location.search);
const editId = params.get("id");


document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    const items = JSON.parse(localStorage.getItem("Inventory") || "[]");

    const itemIndex = items.findIndex((item) => item.itemCode === editId);

    if (itemIndex === -1) {
        alert("Item not found");
        location.href = "./inventory_list_page.html";
        return;
    }

    const item = items[itemIndex];

    const itemCode = document.getElementById("itemCode");
    const itemName = document.getElementById("itemName");
   
    const itemImage = document.getElementById("uploadedImg");
    const changeImgBtn = document.getElementById("changeImgBtn");
    const itemDescription = document.getElementById("itemDescription");
    const category = document.getElementById("category");
    const price = document.getElementById("price");
    const unit = document.getElementById("unit");
    const inStock = document.getElementById("inStock");
    const status = document.getElementById("status");
    const supplier = document.getElementById("supplier");
    const saveBtn = document.getElementById("save-btn");
    const deleteBtn = document.getElementById("deleteBtn");
    const cancelBtn = document.getElementById("cancelBtn");


    itemCode.value = item.itemCode;
    itemName.value = item.itemName;
    itemImage.src = item.itemImage
    itemDescription.value = item.itemDescription;
    category.value = item.category;
    price.value = item.price;
    unit.value = item.unit;
    inStock.value = item.inStock;
    status.value = item.status;
    supplier.value = item.supplier;


    changeImgBtn.addEventListener("click", () => {
        itemImage.click();
    });

    itemImage.addEventListener("change", () => {
        const file = itemImage.files[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        previewImg.src = imageUrl;
    });


    inStock.addEventListener("input", () => {
        if (Number(inStock.value) > 0) {
            status.value = "In Stock";
        } else {
            status.value = "Out of Stock";
        }
    });


    saveBtn.addEventListener("click", () => {
        items[itemIndex] = {
            ...items[itemIndex],
            itemName: itemName.value,
            itemImage: previewImg.src,
            itemDescription: itemDescription.value,
            category: category.value,
            price: price.value,
            unit: unit.value,
            inStock: inStock.value,
            status: Number(inStock.value) > 0 ? "In Stock" : "Out of Stock",
            supplier: supplier.value,
            update_at: new Date().toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            })
        };

        updateToLocal("Inventory", items);

        alert("Item updated successfully");
        location.href = "./inventory.html";
    });


    deleteBtn.addEventListener("click", (e) => {

        e.preventDefault()
        e.stopPropagation()

        document.querySelector('.temp-body').style.display = 'flex'
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.querySelector('.temp-body').style.display = 'none'
        })
        
        document.getElementById('del-btn').addEventListener('click', () => {
            items.splice(itemIndex, 1);
            
            if (updateToLocal("Inventory",items)) {
                document.querySelector('.temp-body').style.display = 'none'
                showPopups("Item deleted successfully", true);

                setTimeout(() => {
                    showPopups('Redirecting to inventory page...', true)
                },1000)

                setTimeout(() => {
                    location.href = "./inventory.html";
                },3500)
            }
            else showPopups('Unknown Error occured', false)
        })

    });


    cancelBtn.addEventListener("click", () => {
        location.href = "./inventory.html";
    });

    function confirmDelete() {

    }
});

