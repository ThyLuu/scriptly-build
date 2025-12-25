// export const templates = [
//     {
//         id: 'blank',
//         label: 'Tài liệu trống',
//         imageUrl: '/blank-document.svg',
//         initialContent: ''
//     },
//     {
//         id: 'report',
//         label: 'Báo cáo',
//         imageUrl: '/report.png',
//         initialContent: `
//             <article>
//             <header>
//                 <h1 style="margin-bottom:4px;">BÁO CÁO</h1>
//                 <p style="margin:0;color:#555;">Tiêu đề báo cáo (sửa lại)</p>
//                 <hr />
//                 <p style="margin:6px 0 0 0;"><strong>Ngày:</strong> <span>…/…/……</span></p>
//                 <p style="margin:2px 0;"><strong>Tác giả:</strong> <span>Tên người lập</span></p>
//                 <p style="margin:2px 0;"><strong>Đơn vị:</strong> <span>Tên phòng ban / công ty</span></p>
//             </header>

//             <section>
//                 <h2>I. Tóm tắt điều hành</h2>
//                 <p>
//                 Đoạn tóm tắt ngắn gọn (5–7 câu) về mục tiêu, phương pháp, phát hiện chính và kiến nghị trọng tâm.
//                 Phần này nên đủ để người quản lý nắm được bức tranh tổng quan trong 1 phút.
//                 </p>
//             </section>

//             <section>
//                 <h2>II. Mục lục</h2>
//                 <ol>
//                 <li>Tóm tắt điều hành</li>
//                 <li>Mục tiêu & Phạm vi</li>
//                 <li>Phương pháp</li>
//                 <li>Kết quả & Phân tích</li>
//                 <li>Bảng & Số liệu</li>
//                 <li>Kết luận</li>
//                 <li>Kiến nghị</li>
//                 <li>Phụ lục</li>
//                 </ol>
//             </section>

//             <section>
//                 <h2>III. Mục tiêu & Phạm vi</h2>
//                 <ul>
//                 <li><strong>Mục tiêu 1:</strong> …</li>
//                 <li><strong>Mục tiêu 2:</strong> …</li>
//                 <li><strong>Phạm vi:</strong> thời gian, khu vực, nhóm dữ liệu…</li>
//                 <li><strong>Giới hạn:</strong> giả định, ràng buộc, thiếu dữ liệu…</li>
//                 </ul>
//             </section>

//             <section>
//                 <h2>IV. Phương pháp</h2>
//                 <p>Mô tả ngắn gọn cách tiếp cận, nguồn dữ liệu, công cụ, tiêu chí đánh giá.</p>
//                 <ul>
//                 <li><strong>Nguồn dữ liệu:</strong> nội bộ/ngoại bộ (nêu rõ tên nguồn)</li>
//                 <li><strong>Công cụ:</strong> Excel, SQL, Python, BI tool, v.v.</li>
//                 <li><strong>Quy trình:</strong> thu thập → làm sạch → phân tích → trực quan hóa</li>
//                 </ul>
//                 <blockquote>Ghi chú: Nêu rõ các giả định quan trọng để người đọc hiểu bối cảnh.</blockquote>
//             </section>

//             <section>
//                 <h2>V. Kết quả & Phân tích</h2>
//                 <h3>1. Phát hiện chính</h3>
//                 <ul>
//                 <li>Insight 1 — mô tả ngắn + tác động.</li>
//                 <li>Insight 2 — mô tả ngắn + tác động.</li>
//                 <li>Insight 3 — mô tả ngắn + tác động.</li>
//                 </ul>

//                 <h3>2. Trực quan (chèn biểu đồ)</h3>
//                 <p>Thay khung bên dưới bằng biểu đồ/ảnh minh họa của bạn.</p>
//                 <div style="border:1px dashed #aaa;padding:12px;text-align:center;border-radius:6px;margin:8px 0;">
//                 <em>Vùng chèn biểu đồ / hình ảnh</em>
//                 </div>
//             </section>

//             <section>
//                 <h2>VI. Bảng & Số liệu</h2>
//                 <table style="width:100%;border-collapse:collapse;">
//                 <thead>
//                     <tr>
//                     <th style="border:1px solid #ddd;padding:6px;text-align:left;">Chỉ tiêu</th>
//                     <th style="border:1px solid #ddd;padding:6px;text-align:right;">Kỳ trước</th>
//                     <th style="border:1px solid #ddd;padding:6px;text-align:right;">Kỳ này</th>
//                     <th style="border:1px solid #ddd;padding:6px;text-align:right;">% thay đổi</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">Doanh thu</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">100</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">120</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">+20%</td>
//                     </tr>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">Chi phí</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">60</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">66</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">+10%</td>
//                     </tr>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">Lợi nhuận</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">40</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">54</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">+35%</td>
//                     </tr>
//                 </tbody>
//                 </table>
//                 <p style="color:#666;margin-top:6px;">*Lưu ý: Thay số liệu minh họa bằng dữ liệu thực tế.</p>
//             </section>

//             <section>
//                 <h2>VII. Kết luận</h2>
//                 <p>Tóm tắt ngắn các điểm chốt rút ra từ phân tích ở trên.</p>
//             </section>

//             <section>
//                 <h2>VIII. Kiến nghị</h2>
//                 <ol>
//                 <li>Hành động 1 (ưu tiên cao) — tác động & người chịu trách nhiệm.</li>
//                 <li>Hành động 2 — thời gian thực hiện và rủi ro.</li>
//                 <li>Hành động 3 — chỉ số đo lường (KPI).</li>
//                 </ol>
//             </section>

//             <section>
//                 <h2>IX. Phụ lục</h2>
//                 <ul>
//                 <li>Định nghĩa thuật ngữ</li>
//                 <li>Ghi chú phương pháp</li>
//                 <li>Liên hệ / tài liệu tham khảo</li>
//                 </ul>
//             </section>

//             <footer>
//                 <hr />
//                 <p><strong>Người lập báo cáo:</strong> …………………………… &nbsp; <strong>Ngày:</strong> …/…/……</p>
//                 <p><strong>Phê duyệt:</strong> …………………………… &nbsp; <strong>Ngày:</strong> …/…/……</p>
//             </footer>
//             </article>
//         `
//     },
//     // {
//     //     id: 'software-proposal',
//     //     label: 'Đề xuất phần mềm',
//     //     imageUrl: '/software-proposal.svg',
//     // },
//     {
//         id: 'project-proposal',
//         label: 'Đề xuất dự án',
//         imageUrl: '/project-proposal.png',
//         initialContent: `
//             <article>
//             <header>
//                 <h1 style="margin-bottom:4px;">ĐỀ XUẤT DỰ ÁN</h1>
//                 <p style="margin:0;color:#555;">Tên dự án: ................................................</p>
//                 <p style="margin:2px 0 0 0;"><strong>Ngày:</strong> …/…/……</p>
//                 <p style="margin:2px 0;"><strong>Người đề xuất:</strong> ................................</p>
//                 <p style="margin:2px 0;"><strong>Đơn vị:</strong> .........................................</p>
//                 <hr />
//             </header>

//             <section>
//                 <h2>I. Tóm tắt dự án</h2>
//                 <p>
//                 Mô tả ngắn gọn lý do hình thành dự án, vấn đề cần giải quyết hoặc cơ hội cần nắm bắt,
//                 cùng với kết quả mong đợi. Phần này cần súc tích để lãnh đạo nhanh chóng nắm được nội dung.
//                 </p>
//             </section>

//             <section>
//                 <h2>II. Mục tiêu</h2>
//                 <ul>
//                 <li><strong>Mục tiêu 1:</strong> ..................................................</li>
//                 <li><strong>Mục tiêu 2:</strong> ..................................................</li>
//                 <li><strong>Chỉ số thành công (KPI):</strong> ..................................</li>
//                 </ul>
//             </section>

//             <section>
//                 <h2>III. Phạm vi & Đối tượng</h2>
//                 <ul>
//                 <li><strong>Phạm vi công việc:</strong> Các chức năng, quy trình, lĩnh vực sẽ được thực hiện.</li>
//                 <li><strong>Ngoài phạm vi:</strong> Các phần không thuộc trách nhiệm dự án.</li>
//                 <li><strong>Đối tượng thụ hưởng:</strong> Bộ phận, khách hàng hoặc nhóm người dùng.</li>
//                 </ul>
//             </section>

//             <section>
//                 <h2>IV. Giải pháp đề xuất</h2>
//                 <p>Mô tả phương án kỹ thuật, công nghệ hoặc quy trình mà nhóm muốn áp dụng.</p>
//                 <div style="border:1px dashed #aaa;padding:12px;margin:8px 0;border-radius:6px;text-align:center;">
//                 <em>Vùng chèn sơ đồ minh họa / wireframe</em>
//                 </div>
//             </section>

//             <section>
//                 <h2>V. Thời gian thực hiện (Timeline)</h2>
//                 <table style="width:100%;border-collapse:collapse;margin:8px 0;">
//                 <thead>
//                     <tr>
//                     <th style="border:1px solid #ddd;padding:6px;">Giai đoạn</th>
//                     <th style="border:1px solid #ddd;padding:6px;">Nội dung công việc</th>
//                     <th style="border:1px solid #ddd;padding:6px;">Thời gian</th>
//                     <th style="border:1px solid #ddd;padding:6px;">Người phụ trách</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">1</td>
//                     <td style="border:1px solid #ddd;padding:6px;">Khởi động & phân tích yêu cầu</td>
//                     <td style="border:1px solid #ddd;padding:6px;">Tuần 1-2</td>
//                     <td style="border:1px solid #ddd;padding:6px;">PM</td>
//                     </tr>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">2</td>
//                     <td style="border:1px solid #ddd;padding:6px;">Thiết kế & phê duyệt</td>
//                     <td style="border:1px solid #ddd;padding:6px;">Tuần 3-4</td>
//                     <td style="border:1px solid #ddd;padding:6px;">Team thiết kế</td>
//                     </tr>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">3</td>
//                     <td style="border:1px solid #ddd;padding:6px;">Phát triển & kiểm thử</td>
//                     <td style="border:1px solid #ddd;padding:6px;">Tuần 5-10</td>
//                     <td style="border:1px solid #ddd;padding:6px;">Dev team</td>
//                     </tr>
//                 </tbody>
//                 </table>
//             </section>

//             <section>
//                 <h2>VI. Ngân sách dự kiến</h2>
//                 <table style="width:100%;border-collapse:collapse;margin:8px 0;">
//                 <thead>
//                     <tr>
//                     <th style="border:1px solid #ddd;padding:6px;">Hạng mục</th>
//                     <th style="border:1px solid #ddd;padding:6px;text-align:right;">Chi phí (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">Nhân sự</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">...</td>
//                     </tr>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">Công cụ / phần mềm</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">...</td>
//                     </tr>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;">Khác</td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;">...</td>
//                     </tr>
//                     <tr>
//                     <td style="border:1px solid #ddd;padding:6px;"><strong>Tổng cộng</strong></td>
//                     <td style="border:1px solid #ddd;padding:6px;text-align:right;"><strong>...</strong></td>
//                     </tr>
//                 </tbody>
//                 </table>
//             </section>

//             <section>
//                 <h2>VII. Rủi ro & Giải pháp</h2>
//                 <ul>
//                 <li><strong>Rủi ro 1:</strong> .................................. → <em>Giải pháp:</em> ..................................</li>
//                 <li><strong>Rủi ro 2:</strong> .................................. → <em>Giải pháp:</em> ..................................</li>
//                 </ul>
//             </section>

//             <section>
//                 <h2>VIII. Kết luận & Kiến nghị</h2>
//                 <p>
//                 Nêu lý do tại sao dự án nên được phê duyệt, giá trị mang lại cho tổ chức và
//                 kiến nghị các bước tiếp theo.
//                 </p>
//             </section>

//             <footer>
//                 <hr />
//                 <p><strong>Người đề xuất:</strong> ....................................</p>
//                 <p><strong>Người phê duyệt:</strong> ...................................</p>
//             </footer>
//             </article>
//         `
//     },
//     {
//         id: 'business-letter',
//         label: 'Thư doanh nghiệp',
//         imageUrl: '/business-letter.png',
//         initialContent: `
//             <article style="font-family:Arial, sans-serif; line-height:1.6; color:#333; max-width:800px; margin:auto;">
//             <header style="text-align:right; margin-bottom:20px;">
//                 <img src="/logo.png" alt="Logo Công ty" style="height:50px; margin-bottom:8px;" />
//                 <p style="margin:2px 0;"><strong>Công ty:</strong> ........................................</p>
//                 <p style="margin:2px 0;"><strong>Địa chỉ:</strong> ........................................</p>
//                 <p style="margin:2px 0;"><strong>Điện thoại:</strong> ....................................</p>
//                 <p style="margin:2px 0;"><strong>Email:</strong> ........................................</p>
//             </header>

//             <section style="margin-bottom:20px;">
//                 <p><em>Hà Nội, ngày … tháng … năm …</em></p>
//                 <p><strong>Kính gửi:</strong> Ông/Bà ....................................................</p>
//                 <p><strong>Chức vụ:</strong> ...........................................................</p>
//                 <p><strong>Công ty:</strong> .........................................................</p>
//             </section>

//             <section style="margin-bottom:20px;">
//                 <p>Kính thưa Quý Ông/Bà,</p>
//                 <p>
//                 Trước tiên, Công ty chúng tôi xin gửi lời chào trân trọng và lời chúc sức khỏe, 
//                 thành công đến Quý Công ty.
//                 </p>
//                 <p>
//                 Nội dung chính của thư: .............................................................
//                 ....................................................................................
//                 ....................................................................................
//                 </p>
//                 <p>
//                 Chúng tôi mong muốn được hợp tác và xây dựng mối quan hệ bền chặt với Quý Công ty trong tương lai.
//                 </p>
//             </section>

//             <section style="margin-bottom:30px;">
//                 <p>Trân trọng,</p>
//                 <p><strong>ĐẠI DIỆN CÔNG TY</strong></p>
//                 <br /><br /><br />
//                 <p>(Ký tên & đóng dấu)</p>
//             </section>

//             <footer style="border-top:1px solid #ccc; padding-top:10px; font-size:0.9em; color:#555;">
//                 <p><strong>Công ty:</strong> ........................................</p>
//                 <p><strong>Website:</strong> .......................................</p>
//             </footer>
//             </article>
//         `
//     },
//     {
//         id: 'resume',
//         label: 'Sơ yếu lý lịch',
//         imageUrl: '/resume.png',
//         initialContent: `
//             <article style="font-family:Arial, sans-serif; line-height:1.6; color:#333; max-width:900px; margin:auto; padding:20px;">
//             <header style="text-align:center; margin-bottom:30px;">
//                 <h1 style="margin:0; font-size:28px;">HỌ VÀ TÊN</h1>
//                 <p style="margin:5px 0;">Địa chỉ: ....................................................</p>
//                 <p style="margin:5px 0;">Điện thoại: ..................... | Email: .....................</p>
//                 <p style="margin:5px 0;">LinkedIn/GitHub (nếu có): ................................</p>
//             </header>

//             <section style="margin-bottom:25px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Mục tiêu nghề nghiệp</h2>
//                 <p>
//                 Tôi mong muốn được làm việc trong lĩnh vực ........................................, 
//                 tận dụng kỹ năng ........................................ để đóng góp vào sự phát triển 
//                 của công ty và phát triển bản thân.
//                 </p>
//             </section>

//             <section style="margin-bottom:25px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Học vấn</h2>
//                 <p><strong>Trường Đại học ................................</strong> (20XX – 20XX)</p>
//                 <ul>
//                 <li>Chuyên ngành: ........................................</li>
//                 <li>Điểm trung bình: ....................................</li>
//                 </ul>
//             </section>

//             <section style="margin-bottom:25px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Kinh nghiệm làm việc</h2>
//                 <p><strong>Công ty ................................</strong> (20XX – nay)</p>
//                 <ul>
//                 <li>Vị trí: ........................................</li>
//                 <li>Mô tả công việc: ........................................</li>
//                 <li>Thành tích đạt được: ....................................</li>
//                 </ul>
//                 <p><strong>Công ty ................................</strong> (20XX – 20XX)</p>
//                 <ul>
//                 <li>Vị trí: ........................................</li>
//                 <li>Mô tả công việc: ........................................</li>
//                 </ul>
//             </section>

//             <section style="margin-bottom:25px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Kỹ năng</h2>
//                 <ul>
//                 <li>Kỹ năng chuyên môn: ........................................</li>
//                 <li>Kỹ năng mềm: ........................................</li>
//                 <li>Ngoại ngữ: ........................................</li>
//                 </ul>
//             </section>

//             <section>
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Hoạt động & Giải thưởng</h2>
//                 <ul>
//                 <li>.................................................................</li>
//                 <li>.................................................................</li>
//                 </ul>
//             </section>
//             </article>
//         `
//     },
//     // {
//     //     id: 'cover-letter',
//     //     label: 'Thư xin việc',
//     //     imageUrl: '/cover-letter.png',
//     // },
//     {
//         id: 'brochure',
//         label: 'Tập quảng cáo',
//         imageUrl: '/brochure.png',
//         initialContent: `
//             <article style="font-family:Arial, sans-serif; line-height:1.6; color:#333; max-width:900px; margin:auto; padding:20px;">

//             <!-- Cover / Header -->
//             <header style="text-align:center; margin-bottom:30px;">
//                 <img src="/brochure-cover.png" alt="Ảnh bìa Brochure" style="max-width:100%; height:auto; border-radius:8px; margin-bottom:15px;" />
//                 <h1 style="margin:0; font-size:32px; color:#0056b3;">Tên Công Ty / Thương Hiệu</h1>
//                 <p style="margin:5px 0; font-size:18px; color:#666;">Slogan hoặc thông điệp ngắn gọn, ấn tượng</p>
//             </header>

//             <!-- Introduction -->
//             <section style="margin-bottom:25px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Giới thiệu</h2>
//                 <p>
//                 Chúng tôi là ............................................................., 
//                 chuyên cung cấp các giải pháp/dịch vụ .........................................
//                 Với đội ngũ giàu kinh nghiệm, chúng tôi cam kết mang đến cho khách hàng những sản phẩm 
//                 và dịch vụ chất lượng nhất.
//                 </p>
//             </section>

//             <!-- Services / Products -->
//             <section style="margin-bottom:25px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Sản phẩm & Dịch vụ nổi bật</h2>
//                 <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
//                 <div style="border:1px solid #ddd; border-radius:8px; padding:15px;">
//                     <img src="/product1.png" alt="Sản phẩm 1" style="width:100%; border-radius:5px; margin-bottom:10px;" />
//                     <h3 style="margin:0;">Sản phẩm/Dịch vụ 1</h3>
//                     <p>Mô tả ngắn gọn về sản phẩm/dịch vụ này, lợi ích và tính năng chính.</p>
//                 </div>
//                 <div style="border:1px solid #ddd; border-radius:8px; padding:15px;">
//                     <img src="/product2.png" alt="Sản phẩm 2" style="width:100%; border-radius:5px; margin-bottom:10px;" />
//                     <h3 style="margin:0;">Sản phẩm/Dịch vụ 2</h3>
//                     <p>Mô tả ngắn gọn về sản phẩm/dịch vụ này, lợi ích và tính năng chính.</p>
//                 </div>
//                 </div>
//             </section>

//             <!-- Promotion -->
//             <section style="margin-bottom:25px; background:#f9f9f9; padding:20px; border-radius:8px; text-align:center;">
//                 <h2 style="color:#d9534f; margin-bottom:10px;">Ưu đãi đặc biệt!</h2>
//                 <p>
//                 Giảm giá <strong>20%</strong> cho khách hàng mới khi đăng ký trong tháng này.<br/>
//                 Liên hệ ngay để nhận tư vấn và ưu đãi hấp dẫn.
//                 </p>
//             </section>

//             <!-- Contact -->
//             <footer style="border-top:2px solid #444; padding-top:15px; text-align:center; margin-top:30px;">
//                 <h2 style="margin-bottom:10px;">Liên hệ</h2>
//                 <p><strong>Địa chỉ:</strong> ........................................................</p>
//                 <p><strong>Điện thoại:</strong> ............................ | <strong>Email:</strong> ....................</p>
//                 <p><strong>Website:</strong> ........................................................</p>
//             </footer>
//             </article>
//         `
//     },
//     {
//         id: 'meeting-notes',
//         label: 'Ghi chú cuộc họp',
//         imageUrl: '/meeting-notes.png',
//         initialContent: `
//             <article style="font-family:Arial, sans-serif; line-height:1.6; color:#333; max-width:900px; margin:auto; padding:20px;">

//             <!-- Header -->
//             <header style="text-align:center; margin-bottom:30px;">
//                 <h1 style="margin:0; font-size:26px; color:#0056b3;">Ghi chú cuộc họp</h1>
//                 <p style="margin:5px 0; font-size:16px; color:#666;">Ngày: ................. | Thời gian: ................. | Địa điểm: .................</p>
//             </header>

//             <!-- Meeting Info -->
//             <section style="margin-bottom:20px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Thông tin cuộc họp</h2>
//                 <ul>
//                 <li><strong>Chủ trì:</strong> ................................................</li>
//                 <li><strong>Thư ký:</strong> ................................................</li>
//                 <li><strong>Chủ đề:</strong> ................................................</li>
//                 </ul>
//             </section>

//             <!-- Attendees -->
//             <section style="margin-bottom:20px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Người tham dự</h2>
//                 <ul>
//                 <li>................................................</li>
//                 <li>................................................</li>
//                 <li>................................................</li>
//                 </ul>
//             </section>

//             <!-- Agenda / Notes -->
//             <section style="margin-bottom:20px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Nội dung chính</h2>
//                 <ol>
//                 <li>Vấn đề 1: ....................................................................</li>
//                 <li>Vấn đề 2: ....................................................................</li>
//                 <li>Vấn đề 3: ....................................................................</li>
//                 </ol>
//             </section>

//             <!-- Decisions -->
//             <section style="margin-bottom:20px;">
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Quyết định</h2>
//                 <ul>
//                 <li>............................................................................</li>
//                 <li>............................................................................</li>
//                 </ul>
//             </section>

//             <!-- Action Items -->
//             <section>
//                 <h2 style="border-bottom:2px solid #444; padding-bottom:5px;">Hành động tiếp theo</h2>
//                 <table style="width:100%; border-collapse:collapse; margin-top:10px;">
//                 <thead>
//                     <tr style="background:#f2f2f2;">
//                     <th style="border:1px solid #ccc; padding:8px; text-align:left;">Nhiệm vụ</th>
//                     <th style="border:1px solid #ccc; padding:8px; text-align:left;">Người phụ trách</th>
//                     <th style="border:1px solid #ccc; padding:8px; text-align:left;">Thời hạn</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                     <td style="border:1px solid #ccc; padding:8px;">................................................</td>
//                     <td style="border:1px solid #ccc; padding:8px;">................................................</td>
//                     <td style="border:1px solid #ccc; padding:8px;">................................................</td>
//                     </tr>
//                 </tbody>
//                 </table>
//             </section>

//             </article>
//         `
//     },
//     {
//         id: 'letter',
//         label: 'Thư',
//         imageUrl: '/letter.png',
//         initialContent: `
//             <article style="font-family:Georgia, serif; line-height:1.6; color:#333; max-width:800px; margin:auto; padding:40px; border:1px solid #ddd;">

//             <!-- Sender Info -->
//             <section style="margin-bottom:30px; text-align:right;">
//                 <p style="margin:2px 0;">Họ và tên người gửi</p>
//                 <p style="margin:2px 0;">Địa chỉ</p>
//                 <p style="margin:2px 0;">Email | Số điện thoại</p>
//                 <p style="margin:2px 0;">Ngày ... tháng ... năm ...</p>
//             </section>

//             <!-- Recipient Info -->
//             <section style="margin-bottom:30px;">
//                 <p style="margin:2px 0;">Kính gửi: Ông/Bà ........................................</p>
//                 <p style="margin:2px 0;">Chức vụ: ..................................................</p>
//                 <p style="margin:2px 0;">Công ty/Tổ chức: ........................................</p>
//                 <p style="margin:2px 0;">Địa chỉ: ...................................................</p>
//             </section>

//             <!-- Letter Body -->
//             <section style="margin-bottom:30px;">
//                 <p>Kính thưa Ông/Bà,</p>
//                 <p>
//                 Tôi viết thư này nhằm ..............................................................  
//                 ....................................................................................  
//                 ....................................................................................
//                 </p>
//                 <p>
//                 Rất mong nhận được sự phản hồi từ Quý Ông/Bà.  
//                 Xin chân thành cảm ơn!
//                 </p>
//             </section>

//             <!-- Signature -->
//             <section style="text-align:right; margin-top:50px;">
//                 <p>Trân trọng,</p>
//                 <p style="margin-top:60px;">........................................</p>
//                 <p><em>(Chữ ký & Họ tên)</em></p>
//             </section>

//             </article>
//         `
//     },
// ]

export const templates = [
  {
    id: 'blank',
    label: 'Tài liệu trống',
    imageUrl: '/blank-document.svg',
    initialContent: '',
  },
  {
    id: 'report',
    label: 'Báo cáo',
    imageUrl: '/report.png',
    initialContent: `
          <h1>BÁO CÁO</h1>
          <p><em>Tiêu đề báo cáo (sửa lại)</em></p>
          <hr />
          <p><strong>Ngày:</strong> …/…/……</p>
          <p><strong>Tác giả:</strong> Tên người lập</p>
          <p><strong>Đơn vị:</strong> Tên phòng ban / công ty</p>

          <h2>I. Tóm tắt điều hành</h2>
          <p>
          Đoạn tóm tắt ngắn gọn (5–7 câu) về mục tiêu, phương pháp,
          phát hiện chính và kiến nghị trọng tâm.
          </p>

          <h2>II. Mục lục</h2>
          <ol>
            <li>Tóm tắt điều hành</li>
            <li>Mục tiêu & Phạm vi</li>
            <li>Phương pháp</li>
            <li>Kết quả & Phân tích</li>
            <li>Bảng & Số liệu</li>
            <li>Kết luận</li>
            <li>Kiến nghị</li>
            <li>Phụ lục</li>
          </ol>

          <h2>III. Mục tiêu & Phạm vi</h2>
          <ul>
            <li><strong>Mục tiêu 1:</strong> …</li>
            <li><strong>Mục tiêu 2:</strong> …</li>
            <li><strong>Phạm vi:</strong> thời gian, khu vực, nhóm dữ liệu…</li>
            <li><strong>Giới hạn:</strong> giả định, ràng buộc, thiếu dữ liệu…</li>
          </ul>

          <h2>IV. Phương pháp</h2>
          <p>Mô tả cách tiếp cận, nguồn dữ liệu, công cụ, tiêu chí đánh giá.</p>
          <ul>
            <li><strong>Nguồn dữ liệu:</strong> nội bộ / ngoại bộ</li>
            <li><strong>Công cụ:</strong> Excel, SQL, Python, BI</li>
            <li><strong>Quy trình:</strong> thu thập → làm sạch → phân tích</li>
          </ul>
          <blockquote>Ghi chú: Nêu rõ các giả định quan trọng.</blockquote>

          <h2>V. Kết quả & Phân tích</h2>
          <h3>1. Phát hiện chính</h3>
          <ul>
            <li>Insight 1 — tác động.</li>
            <li>Insight 2 — tác động.</li>
            <li>Insight 3 — tác động.</li>
          </ul>

          <h3>2. Trực quan</h3>
          <p><em>(Chèn biểu đồ / hình ảnh tại đây)</em></p>

          <h2>VI. Bảng & Số liệu</h2>
          <table>
            <tr>
              <th>Chỉ tiêu</th>
              <th>Kỳ trước</th>
              <th>Kỳ này</th>
              <th>% thay đổi</th>
            </tr>
            <tr>
              <td>Doanh thu</td>
              <td>100</td>
              <td>120</td>
              <td>+20%</td>
            </tr>
            <tr>
              <td>Chi phí</td>
              <td>60</td>
              <td>66</td>
              <td>+10%</td>
            </tr>
            <tr>
              <td>Lợi nhuận</td>
              <td>40</td>
              <td>54</td>
              <td>+35%</td>
            </tr>
          </table>

          <h2>VII. Kết luận</h2>
          <p>Tóm tắt các điểm chính rút ra.</p>

          <h2>VIII. Kiến nghị</h2>
          <ol>
            <li>Hành động 1 — ưu tiên cao</li>
            <li>Hành động 2 — thời gian & rủi ro</li>
            <li>Hành động 3 — KPI</li>
          </ol>

          <h2>IX. Phụ lục</h2>
          <ul>
            <li>Định nghĩa thuật ngữ</li>
            <li>Ghi chú phương pháp</li>
            <li>Tài liệu tham khảo</li>
          </ul>

          <hr />
          <p><strong>Người lập:</strong> ………………… | <strong>Ngày:</strong> …/…/……</p>
          <p><strong>Phê duyệt:</strong> ………………… | <strong>Ngày:</strong> …/…/……</p>
          `,
  },
  {
    id: 'project-proposal',
    label: 'Đề xuất dự án',
    imageUrl: '/project-proposal.png',
    initialContent: `
      <h1>ĐỀ XUẤT DỰ ÁN</h1>
      <p><strong>Tên dự án:</strong> ................................................</p>
      <p><strong>Ngày:</strong> …/…/……</p>
      <p><strong>Người đề xuất:</strong> ................................................</p>
      <p><strong>Đơn vị:</strong> ................................................</p>
      <hr />

      <h2>I. Tóm tắt dự án</h2>
      <p>
        Mô tả ngắn gọn lý do hình thành dự án, vấn đề cần giải quyết hoặc cơ hội cần nắm bắt,
        cùng với kết quả mong đợi. Phần này nên súc tích để người phê duyệt nhanh chóng nắm được nội dung.
      </p>

      <h2>II. Mục tiêu</h2>
      <ul>
        <li><strong>Mục tiêu 1:</strong> ................................................</li>
        <li><strong>Mục tiêu 2:</strong> ................................................</li>
        <li><strong>Chỉ số thành công (KPI):</strong> ................................................</li>
      </ul>

      <h2>III. Phạm vi & Đối tượng</h2>
      <ul>
        <li><strong>Phạm vi công việc:</strong> ................................................</li>
        <li><strong>Ngoài phạm vi:</strong> ................................................</li>
        <li><strong>Đối tượng thụ hưởng:</strong> ................................................</li>
      </ul>

      <h2>IV. Giải pháp đề xuất</h2>
      <p>
        Mô tả phương án kỹ thuật, công nghệ hoặc quy trình dự kiến áp dụng để đạt được mục tiêu dự án.
      </p>
      <p><em>(Chèn sơ đồ, wireframe hoặc hình minh họa tại đây)</em></p>

      <h2>V. Thời gian thực hiện (Timeline)</h2>
      <table>
        <tr>
          <th>Giai đoạn</th>
          <th>Nội dung công việc</th>
          <th>Thời gian</th>
          <th>Người phụ trách</th>
        </tr>
        <tr>
          <td>1</td>
          <td>Khởi động & phân tích yêu cầu</td>
          <td>Tuần 1 – 2</td>
          <td>PM</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Thiết kế & phê duyệt</td>
          <td>Tuần 3 – 4</td>
          <td>Thiết kế</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Phát triển & kiểm thử</td>
          <td>Tuần 5 – 10</td>
          <td>Dev team</td>
        </tr>
      </table>

      <h2>VI. Ngân sách dự kiến</h2>
      <table>
        <tr>
          <th>Hạng mục</th>
          <th>Chi phí (VNĐ)</th>
        </tr>
        <tr>
          <td>Nhân sự</td>
          <td>...</td>
        </tr>
        <tr>
          <td>Công cụ / phần mềm</td>
          <td>...</td>
        </tr>
        <tr>
          <td>Khác</td>
          <td>...</td>
        </tr>
        <tr>
          <td><strong>Tổng cộng</strong></td>
          <td><strong>...</strong></td>
        </tr>
      </table>

      <h2>VII. Rủi ro & Giải pháp</h2>
      <ul>
        <li><strong>Rủi ro 1:</strong> ................................ → <em>Giải pháp:</em> ................................</li>
        <li><strong>Rủi ro 2:</strong> ................................ → <em>Giải pháp:</em> ................................</li>
      </ul>

      <h2>VIII. Kết luận & Kiến nghị</h2>
      <p>
        Tổng kết giá trị dự án mang lại cho tổ chức, lý do nên phê duyệt
        và đề xuất các bước triển khai tiếp theo.
      </p>

      <hr />
      <p><strong>Người đề xuất:</strong> ................................................</p>
      <p><strong>Người phê duyệt:</strong> ................................................</p>
    `,
  },
  {
    id: 'business-letter',
    label: 'Thư doanh nghiệp',
    imageUrl: '/business-letter.png',
    initialContent: `
      <h1>THƯ DOANH NGHIỆP</h1>
      <p><em>(Sửa lại tiêu đề nếu cần)</em></p>
      <hr />

      <p><strong>Công ty:</strong> ........................................</p>
      <p><strong>Địa chỉ:</strong> ........................................</p>
      <p><strong>Điện thoại:</strong> ....................................</p>
      <p><strong>Email:</strong> ........................................</p>

      <p><em>Hà Nội, ngày … tháng … năm …</em></p>

      <h2>I. Thông tin người nhận</h2>
      <ul>
        <li><strong>Kính gửi:</strong> Ông/Bà ........................................</li>
        <li><strong>Chức vụ:</strong> ........................................</li>
        <li><strong>Công ty:</strong> ........................................</li>
      </ul>

      <h2>II. Nội dung thư</h2>
      <p>Kính thưa Quý Ông/Bà,</p>

      <p>
        Trước tiên, Công ty chúng tôi xin gửi tới Quý Ông/Bà lời chào trân trọng
        và lời chúc sức khỏe, thành công.
      </p>

      <p>
        Nội dung chính của thư:
      </p>
      <ul>
        <li>Vấn đề / đề xuất 1</li>
        <li>Vấn đề / đề xuất 2</li>
        <li>Vấn đề / đề xuất 3</li>
      </ul>

      <p>
        Chúng tôi rất mong nhận được sự quan tâm và phản hồi từ Quý Ông/Bà,
        đồng thời hy vọng có cơ hội hợp tác lâu dài trong thời gian tới.
      </p>

      <h2>III. Kết thư</h2>
      <p>Trân trọng,</p>

      <p><strong>ĐẠI DIỆN CÔNG TY</strong></p>
      <p>(Ký tên, ghi rõ họ tên & đóng dấu)</p>

      <hr />

      <p><strong>Người liên hệ:</strong> ........................................</p>
      <p><strong>Website:</strong> ........................................</p>
    `,
  },
  {
    id: 'resume',
    label: 'Sơ yếu lý lịch',
    imageUrl: '/resume.png',
    initialContent: `
      <h1>SƠ YẾU LÝ LỊCH</h1>
      <p><em>(Curriculum Vitae)</em></p>
      <hr />

      <h2>I. Thông tin cá nhân</h2>
      <ul>
        <li><strong>Họ và tên:</strong> ........................................</li>
        <li><strong>Ngày sinh:</strong> …/…/……</li>
        <li><strong>Giới tính:</strong> ........................................</li>
        <li><strong>Địa chỉ:</strong> ........................................</li>
        <li><strong>Điện thoại:</strong> ........................................</li>
        <li><strong>Email:</strong> ........................................</li>
        <li><strong>LinkedIn / GitHub:</strong> (nếu có)</li>
      </ul>

      <h2>II. Mục tiêu nghề nghiệp</h2>
      <p>
        Mong muốn được làm việc trong lĩnh vực ........................................,
        áp dụng các kỹ năng và kiến thức đã học để đóng góp cho sự phát triển
        của tổ chức, đồng thời nâng cao năng lực chuyên môn của bản thân.
      </p>

      <h2>III. Học vấn</h2>
      <ul>
        <li>
          <strong>Trường:</strong> ........................................ (20XX – 20XX)
          <ul>
            <li><strong>Chuyên ngành:</strong> ........................................</li>
            <li><strong>Điểm trung bình:</strong> ........................................</li>
          </ul>
        </li>
      </ul>

      <h2>IV. Kinh nghiệm làm việc</h2>
      <ul>
        <li>
          <strong>Công ty:</strong> ........................................ (20XX – nay)
          <ul>
            <li><strong>Vị trí:</strong> ........................................</li>
            <li><strong>Mô tả công việc:</strong> ........................................</li>
            <li><strong>Thành tích:</strong> ........................................</li>
          </ul>
        </li>
        <li>
          <strong>Công ty:</strong> ........................................ (20XX – 20XX)
          <ul>
            <li><strong>Vị trí:</strong> ........................................</li>
            <li><strong>Mô tả công việc:</strong> ........................................</li>
          </ul>
        </li>
      </ul>

      <h2>V. Kỹ năng</h2>
      <ul>
        <li><strong>Kỹ năng chuyên môn:</strong> ........................................</li>
        <li><strong>Kỹ năng mềm:</strong> ........................................</li>
        <li><strong>Ngoại ngữ:</strong> ........................................</li>
        <li><strong>Tin học:</strong> ........................................</li>
      </ul>

      <h2>VI. Hoạt động & Giải thưởng</h2>
      <ul>
        <li>Hoạt động / giải thưởng 1</li>
        <li>Hoạt động / giải thưởng 2</li>
      </ul>

      <hr />
      <p><strong>Người khai:</strong> ........................................</p>
      <p><strong>Ngày:</strong> …/…/……</p>
    `,
  },
  {
    id: 'brochure',
    label: 'Tập quảng cáo',
    imageUrl: '/brochure.png',
    initialContent: `
      <h1>TẬP QUẢNG CÁO</h1>
      <p><em>(Brochure / Company Profile)</em></p>
      <hr />

      <p><strong>Tên công ty / Thương hiệu:</strong> ........................................</p>
      <p><strong>Slogan / Thông điệp:</strong> ........................................</p>

      <p><em>(Chèn hình ảnh bìa tại đây)</em></p>

      <h2>I. Giới thiệu</h2>
      <p>
        Chúng tôi là .............................................................,
        chuyên cung cấp các sản phẩm / dịch vụ trong lĩnh vực ........................................
      </p>
      <p>
        Với đội ngũ giàu kinh nghiệm và tinh thần đổi mới, chúng tôi cam kết
        mang đến cho khách hàng những giải pháp chất lượng, hiệu quả và bền vững.
      </p>

      <h2>II. Sản phẩm & Dịch vụ nổi bật</h2>

      <h3>1. Sản phẩm / Dịch vụ 1</h3>
      <p><em>(Chèn hình ảnh sản phẩm / dịch vụ)</em></p>
      <ul>
        <li>Mô tả ngắn gọn về sản phẩm / dịch vụ</li>
        <li>Lợi ích chính mang lại cho khách hàng</li>
        <li>Điểm khác biệt nổi bật</li>
      </ul>

      <h3>2. Sản phẩm / Dịch vụ 2</h3>
      <p><em>(Chèn hình ảnh sản phẩm / dịch vụ)</em></p>
      <ul>
        <li>Mô tả ngắn gọn về sản phẩm / dịch vụ</li>
        <li>Lợi ích chính mang lại cho khách hàng</li>
        <li>Điểm khác biệt nổi bật</li>
      </ul>

      <h2>III. Giá trị mang lại</h2>
      <ul>
        <li>Chất lượng & uy tín</li>
        <li>Dịch vụ khách hàng tận tâm</li>
        <li>Giải pháp linh hoạt, phù hợp nhu cầu</li>
      </ul>

      <h2>IV. Ưu đãi & Chương trình khuyến mãi</h2>
      <p>
        <strong>Ưu đãi đặc biệt:</strong> ........................................
      </p>
      <p>
        Áp dụng cho: khách hàng mới / thời gian giới hạn / số lượng có hạn.
      </p>

      <h2>V. Thông tin liên hệ</h2>
      <ul>
        <li><strong>Địa chỉ:</strong> ........................................</li>
        <li><strong>Điện thoại:</strong> ........................................</li>
        <li><strong>Email:</strong> ........................................</li>
        <li><strong>Website:</strong> ........................................</li>
      </ul>

      <hr />
      <p><em>Xin cảm ơn Quý khách đã quan tâm đến sản phẩm và dịch vụ của chúng tôi.</em></p>
    `,
  },
  {
    id: 'meeting-notes',
    label: 'Ghi chú cuộc họp',
    imageUrl: '/meeting-notes.png',
    initialContent: `
          <h1>Ghi chú cuộc họp</h1>
          <p><strong>Ngày:</strong> …… | <strong>Địa điểm:</strong> ……</p>

          <h2>Thông tin cuộc họp</h2>
          <ul>
            <li><strong>Chủ trì:</strong> …</li>
            <li><strong>Thư ký:</strong> …</li>
            <li><strong>Chủ đề:</strong> …</li>
          </ul>

          <h2>Người tham dự</h2>
          <ul>
            <li>…</li>
            <li>…</li>
          </ul>

          <h2>Nội dung chính</h2>
          <ol>
            <li>Vấn đề 1</li>
            <li>Vấn đề 2</li>
          </ol>

          <h2>Quyết định</h2>
          <ul>
            <li>…</li>
          </ul>

          <h2>Hành động tiếp theo</h2>
          <table>
            <tr>
              <th>Nhiệm vụ</th>
              <th>Người phụ trách</th>
              <th>Thời hạn</th>
            </tr>
            <tr>
              <td>…</td>
              <td>…</td>
              <td>…</td>
            </tr>
          </table>
`,
  },
]
