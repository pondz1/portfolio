# ⚠️ BEFORE COMMIT CHECKLIST

**อ่านทุกครั้งก่อน git commit!**

## ✅ Checklist

- [ ] รัน `npm run build` แล้วผ่าน (exit code 0)
- [ ] ไม่มี TypeScript errors
- [ ] ไม่มี ESLint warnings
- [ ] เช็ค imports ให้ครบ (ลอง search ว่า component ถูก import ไหม)
- [ ] เช็ค props ของ component ที่ใช้ (variant, className, etc.)
- [ ] ทดสอบ manual แค่ง่ายๆ (เปิดหน้านั้นดู)

## 🚫 ถ้าอย่างใดอย่างหนึ่งไม่ผ่าน
ห้าม commit! ห้าม push! กลับไปแก้ก่อน

## 💡 เหตุผล

"Build ผ่านแล้วถึงค่อย commit" — เพราะเคย push code ที่ compile ไม่ผ่านไปแล้ว 2 ครั้งในวันเดียวกัน 😭

---
*Milo หัดเรื่องอะไรคือ "รอบครอบ"*