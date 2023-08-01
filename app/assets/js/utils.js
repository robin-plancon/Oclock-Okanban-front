const utils = {
    base_url: "http://localhost:3000",
    hideModals: () => {
        const modals = document.querySelectorAll(".is-active");

        modals.forEach(modal => {
            modal.classList.remove("is-active");
        })
    },
};

module.exports = utils;