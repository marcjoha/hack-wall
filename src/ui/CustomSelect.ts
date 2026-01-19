export class CustomSelect {
    private select: HTMLSelectElement;
    private customSelect: HTMLElement;
    private selectedDiv: HTMLElement;
    private itemsDiv: HTMLElement;

    constructor(selectElement: HTMLSelectElement) {
        this.select = selectElement;
        this.customSelect = document.createElement("div");
        this.customSelect.className = "custom-select";
        this.selectedDiv = document.createElement("div");
        this.itemsDiv = document.createElement("div");

        this.init();
    }

    private init() {
        this.select.style.display = "none";
        this.setupCustomUI();
        this.setupEvents();
        if (this.select.parentNode) {
            this.select.parentNode.insertBefore(this.customSelect, this.select.nextSibling);
        }
        this.customSelect.appendChild(this.selectedDiv);
        this.customSelect.appendChild(this.itemsDiv);
    }

    private setupCustomUI() {
        this.selectedDiv.className = "select-selected";
        this.itemsDiv.className = "select-items select-hide";

        this.updateSelectedDisplay();

        // Create options
        Array.from(this.select.options).forEach((option) => {
            const item = document.createElement("div");
            item.innerHTML = option.innerHTML;
            if (option.dataset.decorator) {
                const span = document.createElement("span");
                span.textContent = option.dataset.decorator;
                item.appendChild(span);
            }

            item.addEventListener("click", () => {
                this.select.value = option.value;
                this.select.dispatchEvent(new Event("change"));
                this.updateSelectedDisplay();
                this.closeAllSelect();
            });

            this.itemsDiv.appendChild(item);
        });
    }

    private updateSelectedDisplay() {
        const selectedOption = this.select.options[this.select.selectedIndex];
        this.selectedDiv.innerHTML = selectedOption.innerHTML;

        // Update active class in items
        Array.from(this.itemsDiv.children).forEach((child) => {
            if (child instanceof HTMLElement) {
                if (child.innerHTML.includes(selectedOption.innerHTML)) {
                    child.classList.add("same-as-selected");
                } else {
                    child.classList.remove("same-as-selected");
                }
            }
        });
    }

    private setupEvents() {
        this.selectedDiv.addEventListener("click", (e) => {
            e.stopPropagation();
            this.closeAllSelect(this.selectedDiv);
            this.itemsDiv.classList.toggle("select-hide");
            this.selectedDiv.classList.toggle("select-arrow-active");
        });

        document.addEventListener("click", () => this.closeAllSelect());

        // Listen for external changes (e.g. from duration/endTime mutual exclusion)
        this.select.addEventListener("change", () => {
            this.updateSelectedDisplay();
        });
    }

    private closeAllSelect(elmnt?: HTMLElement) {
        const x = document.getElementsByClassName("select-items");
        const y = document.getElementsByClassName("select-selected");

        for (let i = 0; i < y.length; i++) {
            if (elmnt === y[i]) {
                // Current element, do nothing
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }

        for (let i = 0; i < x.length; i++) {
            // Check if the current item is the one associated with the clicked select
            // Actually the logic in original code was checking if index was in arrNo, which contained the index of current element.
            // Let's simplify: direct parent check might be hard because we are iterating classes.
            // Replicating original logic exactly:
            if (elmnt && y[i] === elmnt) continue;
            x[i].classList.add("select-hide");
        }
    }
}
