// 주문 폼을 찾아 엑셀 저장 기능을 연결합니다.
const orderForm = document.querySelector("#order-form");
const saveMessage = document.querySelector("#save-message");

// 화면에 표시되는 옵션 이름을 가져옵니다.
function getSelectedOptions() {
  return [...document.querySelectorAll('input[name="options"]:checked')]
    .map((option) => option.closest("label").querySelector("span").textContent.trim())
    .join(", ") || "없음";
}

// 입력된 주문 내용을 엑셀 파일의 한 행으로 만들어 저장합니다.
function saveOrderAsExcel() {
  if (typeof XLSX === "undefined") {
    saveMessage.textContent = "엑셀 기능을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.";
    return;
  }

  const selectedDrink = document.querySelector("#drink");
  const selectedSize = document.querySelector('input[name="size"]:checked');
  const orderData = [{
    주문일시: new Date().toLocaleString("ko-KR"),
    이름: document.querySelector("#customer-name").value,
    이메일: document.querySelector("#email").value || "미입력",
    전화번호: document.querySelector("#phone").value || "미입력",
    음료: selectedDrink.options[selectedDrink.selectedIndex].text,
    사이즈: selectedSize ? selectedSize.value : "미선택",
    추가옵션: getSelectedOptions(),
    요청사항: document.querySelector("#requests").value || "없음"
  }];

  const worksheet = XLSX.utils.json_to_sheet(orderData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "주문내역");
  XLSX.writeFile(workbook, `바이브카페_주문_${getFileDate()}.xlsx`);

  saveMessage.textContent = "주문 정보가 엑셀 파일로 저장되었습니다.";
}

// 파일 이름에 사용할 날짜를 YYYYMMDD 형식으로 만듭니다.
function getFileDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!orderForm.reportValidity()) {
    return;
  }

  saveOrderAsExcel();
});

orderForm.addEventListener("reset", () => {
  saveMessage.textContent = "";
});