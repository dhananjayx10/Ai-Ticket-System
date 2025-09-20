export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-red-100', 'bg-red-500', 'text-red-600', 'text-red-700', 'text-red-800',
    'bg-blue-100', 'bg-blue-500', 'text-blue-600', 'text-blue-700', 'text-blue-800',
    'bg-green-100', 'bg-green-500', 'text-green-600', 'text-green-700', 'text-green-800',
    'bg-orange-100', 'bg-orange-500', 'text-orange-600', 'text-orange-700', 'text-orange-800',
    'bg-gray-100', 'bg-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800',
    'bg-yellow-100', 'text-yellow-600'
  ]
}