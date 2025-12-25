export const templates = [
  {
    id: 'blank',
    label: 'Tài liệu trống',
    imageUrl: '/blank-document.svg',
    initialContent: ''
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
            Đoạn tóm tắt ngắn gọn (5–7 câu) về mục tiêu, phương pháp, phát hiện chính
            và kiến nghị trọng tâm. Phần này giúp người quản lý nắm tổng quan trong 1 phút.
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
            <p>Mô tả cách tiếp cận, nguồn dữ liệu, công cụ và tiêu chí đánh giá.</p>
            <ul>
              <li><strong>Nguồn dữ liệu:</strong> nội bộ / ngoại bộ</li>
              <li><strong>Công cụ:</strong> Excel, SQL, Python, BI tool</li>
              <li><strong>Quy trình:</strong> thu thập → làm sạch → phân tích → trực quan hóa</li>
            </ul>
            <blockquote>Ghi chú: Nêu rõ các giả định quan trọng để người đọc hiểu bối cảnh.</blockquote>

            <h2>V. Kết quả & Phân tích</h2>
            <h3>1. Phát hiện chính</h3>
            <ul>
              <li>Insight 1 — mô tả ngắn và tác động</li>
              <li>Insight 2 — mô tả ngắn và tác động</li>
              <li>Insight 3 — mô tả ngắn và tác động</li>
            </ul>

            <h3>2. Trực quan</h3>
            <p><em>Chèn biểu đồ hoặc hình ảnh tại đây</em></p>

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
            <p><em>*Lưu ý: Thay số liệu minh họa bằng dữ liệu thực tế.</em></p>

            <h2>VII. Kết luận</h2>
            <p>Tóm tắt các điểm chốt rút ra từ phân tích.</p>

            <h2>VIII. Kiến nghị</h2>
            <ol>
              <li>Hành động 1 — ưu tiên cao</li>
              <li>Hành động 2 — thời gian & rủi ro</li>
              <li>Hành động 3 — chỉ số đo lường (KPI)</li>
            </ol>

            <h2>IX. Phụ lục</h2>
            <ul>
              <li>Định nghĩa thuật ngữ</li>
              <li>Ghi chú phương pháp</li>
              <li>Tài liệu tham khảo</li>
            </ul>

            <hr />
            <p><strong>Người lập báo cáo:</strong> ……………………………</p>
            <p><strong>Phê duyệt:</strong> ……………………………</p>
        `
  },
  // {
  //     id: 'software-proposal',
  //     label: 'Đề xuất phần mềm',
  //     imageUrl: '/software-proposal.svg',
  // },
  {
    id: 'project-proposal',
    label: 'Đề xuất dự án',
    imageUrl: '/project-proposal.png',
    initialContent: `
            <h1>ĐỀ XUẤT DỰ ÁN</h1>
            <p><em>Tên dự án: ................................................</em></p>
            <p><strong>Ngày:</strong> …/…/……</p>
            <p><strong>Người đề xuất:</strong> ................................</p>
            <p><strong>Đơn vị:</strong> .........................................</p>
            <hr />

            <h2>I. Tóm tắt dự án</h2>
            <p>
            Mô tả ngắn gọn lý do hình thành dự án, vấn đề cần giải quyết hoặc cơ hội cần nắm bắt,
            cùng với kết quả mong đợi. Phần này cần súc tích để lãnh đạo nhanh chóng nắm được nội dung.
            </p>

            <h2>II. Mục tiêu</h2>
            <ul>
              <li><strong>Mục tiêu 1:</strong> ..................................................</li>
              <li><strong>Mục tiêu 2:</strong> ..................................................</li>
              <li><strong>Chỉ số thành công (KPI):</strong> ..................................</li>
            </ul>

            <h2>III. Phạm vi &amp; Đối tượng</h2>
            <ul>
              <li><strong>Phạm vi công việc:</strong> Các chức năng, quy trình, lĩnh vực sẽ được thực hiện.</li>
              <li><strong>Ngoài phạm vi:</strong> Các phần không thuộc trách nhiệm dự án.</li>
              <li><strong>Đối tượng thụ hưởng:</strong> Bộ phận, khách hàng hoặc nhóm người dùng.</li>
            </ul>

            <h2>IV. Giải pháp đề xuất</h2>
            <p>Mô tả phương án kỹ thuật, công nghệ hoặc quy trình mà nhóm muốn áp dụng.</p>
            <p><em>Vùng chèn sơ đồ minh họa / wireframe</em></p>

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
                <td>Khởi động &amp; phân tích yêu cầu</td>
                <td>Tuần 1–2</td>
                <td>PM</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Thiết kế &amp; phê duyệt</td>
                <td>Tuần 3–4</td>
                <td>Team thiết kế</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Phát triển &amp; kiểm thử</td>
                <td>Tuần 5–10</td>
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

            <h2>VII. Rủi ro &amp; Giải pháp</h2>
            <ul>
              <li><strong>Rủi ro 1:</strong> .................................. → <em>Giải pháp:</em> ..................................</li>
              <li><strong>Rủi ro 2:</strong> .................................. → <em>Giải pháp:</em> ..................................</li>
            </ul>

            <h2>VIII. Kết luận &amp; Kiến nghị</h2>
            <p>
            Nêu lý do tại sao dự án nên được phê duyệt, giá trị mang lại cho tổ chức
            và kiến nghị các bước tiếp theo.
            </p>

            <hr />
            <p><strong>Người đề xuất:</strong> ....................................</p>
            <p><strong>Người phê duyệt:</strong> ...................................</p>
        `
  },
  {
    id: 'business-letter',
    label: 'Thư doanh nghiệp',
    imageUrl: '/business-letter.png',
    initialContent: `
            <p><img src="/logo.png" alt="Logo Công ty" /></p>

            <p><strong>Công ty:</strong> ........................................</p>
            <p><strong>Địa chỉ:</strong> ........................................</p>
            <p><strong>Điện thoại:</strong> ....................................</p>
            <p><strong>Email:</strong> ........................................</p>

            <p><em>Hà Nội, ngày … tháng … năm …</em></p>

            <p><strong>Kính gửi:</strong> Ông/Bà ....................................................</p>
            <p><strong>Chức vụ:</strong> ...........................................................</p>
            <p><strong>Công ty:</strong> .........................................................</p>

            <p>Kính thưa Quý Ông/Bà,</p>

            <p>
            Trước tiên, Công ty chúng tôi xin gửi lời chào trân trọng và lời chúc sức khỏe,
            thành công đến Quý Công ty.
            </p>

            <p>
            Nội dung chính của thư: .............................................................
            ....................................................................................
            ....................................................................................
            </p>

            <p>
            Chúng tôi mong muốn được hợp tác và xây dựng mối quan hệ bền chặt với Quý Công ty trong tương lai.
            </p>

            <p>Trân trọng,</p>

            <p><strong>ĐẠI DIỆN CÔNG TY</strong></p>

            <br />
            <br />
            <br />

            <p>(Ký tên &amp; đóng dấu)</p>

            <hr />

            <p><strong>Công ty:</strong> ........................................</p>
            <p><strong>Website:</strong> .......................................</p>
        `
  },
  {
    id: 'resume',
    label: 'Sơ yếu lý lịch',
    imageUrl: '/resume.png',
    initialContent: `
            <h1>HỌ VÀ TÊN</h1>

            <p>Địa chỉ: ....................................................</p>
            <p>Điện thoại: ..................... | Email: .....................</p>
            <p>LinkedIn/GitHub (nếu có): ................................</p>

            <h2>Mục tiêu nghề nghiệp</h2>
            <p>
            Tôi mong muốn được làm việc trong lĩnh vực ........................................,
            tận dụng kỹ năng ........................................ để đóng góp vào sự phát triển
            của công ty và phát triển bản thân.
            </p>

            <h2>Học vấn</h2>
            <p><strong>Trường Đại học ................................</strong> (20XX – 20XX)</p>
            <ul>
              <li>Chuyên ngành: ........................................</li>
              <li>Điểm trung bình: ....................................</li>
            </ul>

            <h2>Kinh nghiệm làm việc</h2>
            <p><strong>Công ty ................................</strong> (20XX – nay)</p>
            <ul>
              <li>Vị trí: ........................................</li>
              <li>Mô tả công việc: ........................................</li>
              <li>Thành tích đạt được: ....................................</li>
            </ul>

            <p><strong>Công ty ................................</strong> (20XX – 20XX)</p>
            <ul>
              <li>Vị trí: ........................................</li>
              <li>Mô tả công việc: ........................................</li>
            </ul>

            <h2>Kỹ năng</h2>
            <ul>
              <li>Kỹ năng chuyên môn: ........................................</li>
              <li>Kỹ năng mềm: ........................................</li>
              <li>Ngoại ngữ: ........................................</li>
            </ul>

            <h2>Hoạt động &amp; Giải thưởng</h2>
            <ul>
              <li>.................................................................</li>
              <li>.................................................................</li>
            </ul>
        `
  },
  // {
  //     id: 'cover-letter',
  //     label: 'Thư xin việc',
  //     imageUrl: '/cover-letter.png',
  // },
  {
    id: 'brochure',
    label: 'Tập quảng cáo',
    imageUrl: '/brochure.png',
    initialContent: `
            <p><img src="/brochure-cover.png" alt="Ảnh bìa Brochure" /></p>

            <h1>Tên Công Ty / Thương Hiệu</h1>
            <p><em>Slogan hoặc thông điệp ngắn gọn, ấn tượng</em></p>

            <h2>Giới thiệu</h2>
            <p>
            Chúng tôi là .............................................................,
            chuyên cung cấp các giải pháp/dịch vụ .........................................
            Với đội ngũ giàu kinh nghiệm, chúng tôi cam kết mang đến cho khách hàng
            những sản phẩm và dịch vụ chất lượng nhất.
            </p>

            <h2>Sản phẩm &amp; Dịch vụ nổi bật</h2>

            <p><img src="/product1.png" alt="Sản phẩm 1" /></p>
            <h3>Sản phẩm/Dịch vụ 1</h3>
            <p>Mô tả ngắn gọn về sản phẩm/dịch vụ này, lợi ích và tính năng chính.</p>

            <p><img src="/product2.png" alt="Sản phẩm 2" /></p>
            <h3>Sản phẩm/Dịch vụ 2</h3>
            <p>Mô tả ngắn gọn về sản phẩm/dịch vụ này, lợi ích và tính năng chính.</p>

            <h2>Ưu đãi đặc biệt!</h2>
            <p>
            Giảm giá <strong>20%</strong> cho khách hàng mới khi đăng ký trong tháng này.<br />
            Liên hệ ngay để nhận tư vấn và ưu đãi hấp dẫn.
            </p>

            <h2>Liên hệ</h2>
            <p><strong>Địa chỉ:</strong> ........................................................</p>
            <p><strong>Điện thoại:</strong> ............................ | <strong>Email:</strong> ....................</p>
            <p><strong>Website:</strong> ........................................................</p>
        `
  },
  {
    id: 'meeting-notes',
    label: 'Ghi chú cuộc họp',
    imageUrl: '/meeting-notes.png',
    initialContent: `
            <h1>Ghi chú cuộc họp</h1>
            <p><em>Ngày:</em> ................. | <em>Thời gian:</em> ................. | <em>Địa điểm:</em> .................</p>

            <h2>Thông tin cuộc họp</h2>
            <ul>
              <li><strong>Chủ trì:</strong> ................................................</li>
              <li><strong>Thư ký:</strong> ................................................</li>
              <li><strong>Chủ đề:</strong> ................................................</li>
            </ul>

            <h2>Người tham dự</h2>
            <ul>
              <li>................................................</li>
              <li>................................................</li>
              <li>................................................</li>
            </ul>

            <h2>Nội dung chính</h2>
            <ol>
              <li>Vấn đề 1: ....................................................................</li>
              <li>Vấn đề 2: ....................................................................</li>
              <li>Vấn đề 3: ....................................................................</li>
            </ol>

            <h2>Quyết định</h2>
            <ul>
              <li>............................................................................</li>
              <li>............................................................................</li>
            </ul>

            <h2>Hành động tiếp theo</h2>
            <table>
              <tr>
                <th>Nhiệm vụ</th>
                <th>Người phụ trách</th>
                <th>Thời hạn</th>
              </tr>
              <tr>
                <td>................................................</td>
                <td>................................................</td>
                <td>................................................</td>
              </tr>
            </table>
        `
  },
  {
    id: 'letter',
    label: 'Thư',
    imageUrl: '/letter.png',
    initialContent: `
            <p>Họ và tên người gửi</p>
            <p>Địa chỉ</p>
            <p>Email | Số điện thoại</p>
            <p>Ngày ... tháng ... năm ...</p>

            <p><strong>Kính gửi:</strong> Ông/Bà ........................................</p>
            <p><strong>Chức vụ:</strong> ..................................................</p>
            <p><strong>Công ty/Tổ chức:</strong> ........................................</p>
            <p><strong>Địa chỉ:</strong> ...................................................</p>

            <p>Kính thưa Ông/Bà,</p>

            <p>
            Tôi viết thư này nhằm ..............................................................
            ....................................................................................
            ....................................................................................
            </p>

            <p>
            Rất mong nhận được sự phản hồi từ Quý Ông/Bà.
            Xin chân thành cảm ơn!
            </p>

            <p>Trân trọng,</p>

            <br />
            <br />
            <br />

            <p>........................................</p>
            <p><em>(Chữ ký &amp; Họ tên)</em></p>
        `
  },
]