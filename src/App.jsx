import React, { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
// Swiper importlari
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h"
      );
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white">
      <header className="bg-[#0d0e10] text-white py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="text-blue-500 text-xl font-bold">CRYPTOFOLIO</div>
          <div className="flex items-center gap-4">
            <select className="bg-[#1a1b1e] text-white border border-gray-700 rounded-lg py-2 px-4 focus:outline-none">
              <option value="usd">USD</option>
              <option value="inr">INR</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4">
              WATCH LIST
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Autoplay Slider with Crypto Data */}
          <div className="mb-6">
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper"
            >
              {data.slice(0, 4).map((coin) => (
                <SwiperSlide key={coin.id}>
                  <div className="flex flex-col items-center bg-[#2c2d30] p-4 rounded-lg shadow-lg">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-16 h-16 mb-2"
                    />
                    <div className="text-lg font-bold">{coin.name}</div>
                    <div className="text-gray-400 text-sm">
                      {coin.symbol.toUpperCase()}
                    </div>
                    <div className="text-xl font-semibold">
                      ${coin.current_price.toLocaleString()}
                    </div>
                    <div
                      className={`mt-1 ${
                        coin.price_change_percentage_24h > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search For a Crypto Currency.."
              className="w-full bg-[#2c2d30] border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Crypto Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="py-4 px-4 text-gray-400">Coin</th>
                    <th className="py-4 px-4 text-gray-400">Price</th>
                    <th className="py-4 px-4 text-gray-400">24h Change</th>
                    <th className="py-4 px-4 text-gray-400">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((coin) => (
                    <tr
                      key={coin.id}
                      className="border-b border-gray-700 hover:bg-[#2c2d30] transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8"
                          />
                          <div>
                            <div className="font-medium">{coin.name}</div>
                            <div className="text-gray-400 text-sm uppercase">
                              {coin.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        ${coin.current_price.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className={`flex items-center gap-1 ${
                            coin.price_change_percentage_24h > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        ${coin.market_cap.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
