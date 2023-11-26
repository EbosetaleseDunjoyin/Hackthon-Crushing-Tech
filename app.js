

document.addEventListener("DOMContentLoaded", function () {
  // define all the trigers
  const notificationBtn = document.getElementById("alert-button");
  const profileBtn = document.getElementById("profile-button");
  const alertClose = document.querySelectorAll("#alert-close");
  const setupOpen = document.getElementById("setup-button-arrow");
  //Define the menus
  const notificationMenu = document.querySelector("#alert-menu");
  const profileMenu = document.querySelector("#profile-menu");
  const setupDetails = document.querySelector(".setup-details");

  //AlertPopup
  const alertPopup = document.querySelector("main .alert");

  // Get all setup details
  const setupDetail = document.querySelectorAll(".detail-button");
  // const setupDetail = document.querySelectorAll(".setup-detail");

  // Get all the setup check button
  const detailCheck = document.querySelectorAll(".detail-check");

  // Get the progress barr output
  const progressDataOutput = document.querySelector(".progress span");

  //Get all focusable items in the dom
  const allFocusedItem = document.querySelectorAll(
    'button, input, [tabindex]:not([tabindex="-1"])'
  );

  //Toogle Header menus-----------------------------

  //   toggle function
  function toggleClass(trigger, action) {
    const listItems = action.querySelectorAll('[role="menuitem"]');
    trigger?.addEventListener("click", toggleMenu);

    function toggleMenu() {
      action.classList.toggle("d-flex");
      //Checkes and expands items
      isExpanded(trigger) ? closeMenu(trigger) : openMenu(trigger);
    }

    function openMenu(item) {
      //If menu is open
      item.ariaExpanded = "true";
      // console.log(item)
      listItems.item(0).focus();
      // when a particular key is cliked
      action.addEventListener("keyup", handleMenuEscapeKeypress);
    }

    function closeMenu(item) {
      // if menu is closed;
      item.ariaExpanded = "false";
      item.focus();
    }
    function handleMenuEscapeKeypress(event) {
      // if user pressed escape key
      if (event.key === "Escape") {
        toggleMenu();
      }
    }
  }

  let isExpanded = (item) => {
    // console.log(item.attributes)
    if (item.attributes) {
      return item.attributes["aria-expanded"].value === "true";
    }
  };

  //Alert menu trigger
  toggleClass(notificationBtn, notificationMenu);

  //Profile Menu Trigger
  toggleClass(profileBtn, profileMenu);

  function handleMenuItemArrowKeyPress(event, itemIndex) {
    // create some helpful variables : isLastMenuItem, isFirstMenuItem
    const isLastMenuItem = itemIndex === allFocusedItem.length - 1;
    const isFirstMenuItem = itemIndex === 0;

    const nextMenuItem = allFocusedItem.item(itemIndex + 1);
    const previousMenuItem = allFocusedItem.item(itemIndex - 1);

    // if the user pressed arrow right or arrow down
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      // if user is on last item, focus on first menuitem
      if (isLastMenuItem) {
        allFocusedItem.item(0).focus();

        return;
      }
      // then focus on next menu item
      nextMenuItem.focus();
    }

    // if the user pressed arrow up or arrow left
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirstMenuItem) {
        allFocusedItem.item(allFocusedItem.length - 1).focus();
        return;
      }

      previousMenuItem.focus();
    }
    // then focus on the previous menu item
    // if the user is on first menu item, focus on last menuitem
  }

  allFocusedItem.forEach(function (item, itemIndex) {
    item.addEventListener("keyup", function (event) {
      handleMenuItemArrowKeyPress(event, itemIndex);
    });
  });

  // Toggle Alert close
  alertClose.forEach((item) => {
    item.addEventListener("click", () => {
      // console.log("dsds")
      alertPopup.classList.toggle("d-none");
    });
  });

  //Handles the opening and closing of the setup guide div
  setupOpen?.addEventListener("click", function () {
    this.classList.toggle("rotate");
    setupDetails.classList.toggle("d-none"); 
    if(setupDetails.classList.contains("d-none")){
      this.ariaExpanded = "false";
    }else{
      this.ariaExpanded = "true";
    }

  });

  //Setup Guide function------------------------------------------
  setupDetail.forEach((item) => tooglesetupDetail(item));

  // Toggle items
  function tooglesetupDetail(item) {
    item.addEventListener("click", function (event) {
      // Toggle the "open" class on the clicked item
      if (event.target.closest(".detail-check")) {
        event.stopPropagation();
        return;
      }
      let setupDetailNode = this.closest(".setup-detail");
      setupDetailNode.classList.toggle("open");
      if (!setupDetailNode.classList.contains("open")) {
        this.ariaExpanded = "false";
      } else {
        this.ariaExpanded = "true";
      }

      // Close others  when one is opened
      setupDetail.forEach(function (otherItem) {
        let otherItemDetail = otherItem.closest(".setup-detail");
        if (otherItem !== item && otherItemDetail.classList.contains("open")) {
          otherItemDetail.classList.remove("open");
        }
      });

      
    });
  }


  // Button to check task as completed 
//  detailCheck.forEach(function (element) {
//    element.addEventListener("click", function (event) {
//      //event.stopPropagation(); // Prevent setupDetail click event propagation

//      let setupDetailNode = element.closest(".setup-detail");
//      let check = this.classList.contains("checked");

//      if (!check) {
//        // If the check is being added, close other setupDetail panels
//       removeInactiveSetup();
//      }

//      this.classList.toggle("checked");
//      setupDetailNode.classList.add("open");
//      removeInactiveSetup();

//      function removeInactiveSetup(){

//        setupDetail.forEach(function (otherItem) {
//          if (
//            otherItem !== setupDetailNode &&
//            otherItem.classList.contains("open")
//          ) {
//            otherItem.classList.remove("open");
//          }
//        });

       
//      }

//      // Update progress value
//      let progressValue = document.getElementById("progressBar");
//      let checkedSetupButtons = document.querySelectorAll(
//        ".detail .detail-check.checked"
//      );

//      progressValue.value = checkedSetupButtons.length;
//      progressDataOutput.textContent = checkedSetupButtons.length;
//    });
//  });
detailCheck.forEach(function (element) {
  element.addEventListener("click", function (event) {
    // event.stopPropagation(); // Prevent setupDetail click event propagation

    let setupDetailNode = element.closest(".setup-detail");
    let check = this.classList.contains("checked");
    let setups = document.querySelectorAll(".setup-detail")

    if (!check) {
      // If the check is being added, close other setupDetail panels and open the next unchecked one
      removeCurrentAndOpenNext();
      this.ariaLabel  = this.ariaLabel.replace("as done", "as not done")
    } else{
      this.ariaLabel  = this.ariaLabel.replace("as not done", "as done");

    }

    this.classList.toggle("checked");

    function removeCurrentAndOpenNext() {
      let foundChecked = false;
      setups.forEach(function (item) {
        if (foundChecked && !item.classList.contains("open")) {
          item.classList.add("open");
          foundChecked = false; // To open only the next unchecked setupDetail
          return;
        }
        if (item === setupDetailNode) {
          foundChecked = true;
          item.classList.remove("open"); // Close the current setupDetail
        }
        if (item !== setupDetailNode && item.classList.contains("open")) {
          item.classList.remove("open");
        }
      });
    }

    function updateProgressValue() {
      let progressValue = document.getElementById("progressBar");
      let checkedSetupButtons = document.querySelectorAll(
        ".detail .detail-check.checked"
      );

      progressValue.value = checkedSetupButtons.length;
      progressDataOutput.textContent = checkedSetupButtons.length;
    }

    updateProgressValue();
  });
});

});

