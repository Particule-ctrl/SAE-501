import React from 'react'


export default function Footer() {
  return (
        <footer className="py-8 bg-slate-800 dark:bg-gray-900">
            <div className="container">
                <div className="grid md:grid-cols-12 items-center">
                    <div className="md:col-span-3">
                    </div>

                    <div className="md:col-span-5 md:mt-0 mt-8">
                        <div className="text-center">
                            <p className="text-gray-400">© {new Date().getFullYear()} CFM. Design & Develop with <i className="mdi mdi-heart text-red-700"></i> </p>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
  )
}
