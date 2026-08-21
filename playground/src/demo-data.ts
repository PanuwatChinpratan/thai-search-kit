import type { SearchDocument } from "../../src";

type DemoMetadata = {
  answer: string;
};

export const demoDocuments: Array<SearchDocument<DemoMetadata>> = [
  {
    id: "product.white-shirt",
    category: "สินค้า",
    title: "เสื้อเชิ้ตสีขาวสำหรับทำงาน",
    keywords: ["เสื้อทำงาน", "เชิ้ตขาว", "เสื้อออฟฟิศ"],
    content: "เสื้อเชิ้ตผ้าคอตตอนทรง regular fit",
    metadata: { answer: "เสื้อเชิ้ตผ้าคอตตอนสีขาว เหมาะสำหรับใส่ทำงาน" },
  },
  {
    id: "product.running-shoes",
    category: "สินค้า",
    title: "รองเท้าวิ่งน้ำหนักเบา",
    keywords: ["รองเท้าจ็อกกิ้ง", "รองเท้าออกกำลังกาย", "วิ่งมาราธอน"],
    content: "รองเท้าวิ่งพื้นโฟมสำหรับซ้อมระยะกลาง",
    metadata: { answer: "รองเท้าวิ่งพื้นโฟม น้ำหนักเบา เหมาะกับการซ้อมทุกวัน" },
  },
  {
    id: "help.shipping-time",
    category: "ช่วยเหลือ",
    title: "จัดส่งสินค้ากี่วัน",
    keywords: ["ส่งของกี่วัน", "ของถึงเมื่อไหร่", "ระยะเวลาจัดส่ง"],
    content: "จัดส่งภายใน 1–3 วันทำการ",
    metadata: { answer: "จัดส่งภายใน 1–3 วันทำการ" },
  },
  {
    id: "help.payment-methods",
    category: "ช่วยเหลือ",
    title: "ช่องทางการชำระเงิน",
    keywords: ["ชำระเงินยังไง", "จ่ายแบบไหน", "รับบัตรไหม"],
    content: "รองรับบัตร พร้อมเพย์ และโมบายแบงก์กิ้ง",
    metadata: { answer: "รองรับบัตร พร้อมเพย์ และโมบายแบงก์กิ้ง" },
  },
  {
    id: "command.export-csv",
    category: "คำสั่ง",
    title: "ส่งออกรายงานเป็น CSV",
    keywords: ["export csv", "ดาวน์โหลดรายงาน", "เซฟตาราง"],
    content: "เปิดหน้ารายงานแล้วเลือก ส่งออก → CSV",
    metadata: { answer: "เปิดหน้ารายงานแล้วเลือก ส่งออก → CSV" },
  },
  {
    id: "command.dark-mode",
    category: "คำสั่ง",
    title: "เปิดโหมดมืด",
    keywords: ["dark mode", "ธีมดำ", "เปลี่ยนธีม"],
    content: "ไปที่การตั้งค่า ลักษณะที่ปรากฏ แล้วเลือกโหมดมืด",
    metadata: { answer: "การตั้งค่า → ลักษณะที่ปรากฏ → โหมดมืด" },
  },
  {
    id: "document.annual-leave",
    category: "เอกสาร",
    title: "นโยบายวันลาพักร้อน",
    keywords: ["วันลา", "ลาพักร้อนได้กี่วัน", "annual leave"],
    content: "พนักงานประจำมีวันลาพักร้อน 10 วันต่อปี",
    metadata: { answer: "พนักงานประจำมีวันลาพักร้อน 10 วันต่อปี" },
  },
  {
    id: "document.expenses",
    category: "เอกสาร",
    title: "เบิกค่าใช้จ่าย",
    keywords: ["เบิกเงิน", "เคลมค่าเดินทาง", "expense claim"],
    content: "ส่งใบเสร็จผ่านระบบภายใน 30 วัน",
    metadata: { answer: "ส่งใบเสร็จผ่านระบบภายใน 30 วัน" },
  },
];
