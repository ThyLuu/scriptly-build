'use client'

import { SignInButton } from "@clerk/nextjs"
import Image from "next/image"

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-2 border-b">
                <div className="text-3xl font-bold">Scriptly</div>
                <SignInButton mode="modal">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                        Đăng nhập
                    </button>
                </SignInButton>
            </header>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-8 mt-6">
                {/* Hero */}
                <h1 className="text-4xl font-bold mb-4">Chào mừng đến với Scriptly 🚀</h1>
                <p className="text-lg text-gray-600 max-w-xl mb-6">
                    Công cụ soạn thảo nội dung và cộng tác trực tuyến
                </p>

                <SignInButton mode="modal">
                    <button className="px-6 py-2 font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                        Bắt đầu
                    </button>
                </SignInButton>

                {/* Hero Image */}
                <div>
                    <Image src={'/manager-desk.png'} alt="Ảnh" width={450} height={450} />
                </div>

                {/* Features section */}
                <section className="grid gap-8 md:grid-cols-3 text-left max-w-5xl w-full">
                    <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">✍️ Soạn thảo thông minh</h3>
                        <p className="text-gray-600">
                            Trình soạn thảo mạnh mẽ với các công cụ soạn thảo thông minh, giúp bạn viết nhanh hơn và chính xác hơn.
                        </p>
                    </div>
                    <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">🤝 Cộng tác thời gian thực</h3>
                        <p className="text-gray-600">
                            Nhiều người cùng chỉnh sửa, thảo luận và phản hồi ngay trong tài liệu.
                        </p>
                    </div>
                    <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">🗨️ Tương tác trực tiếp</h3>
                        <p className="text-gray-600">
                            Trao đổi, bình luận và phản hồi ngay trong tài liệu để cộng tác hiệu quả hơn.
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-5 flex justify-between items-center px-8 py-4 border-t text-gray-600 text-sm">
                <div>Scriptly</div>
                <div>Lưu Thy Thy - 1050080078</div>
            </footer>
        </div>
    )
}
