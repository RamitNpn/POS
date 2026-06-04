export default function AnalyticsSection() {
  return (
    <section
      id="analytics"
      className="py-24 lg:px-12 md:px-8 px-6 mx-auto bg-[#0f0f0f]"
    >
      <div className="grid lg:grid-cols-3 gap-8">

        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h6 className="font-bold text-white">Daily Revenue</h6>
            <span className="text-yellow-400 text-sm">+12.4%</span>
          </div>

          <div className="h-48 flex items-end gap-2 px-2">
            <div className="bg-yellow-400/20 w-full rounded-t-lg h-[40%]" />
            <div className="bg-yellow-400/40 w-full rounded-t-lg h-[65%]" />
            <div className="bg-yellow-400/20 w-full rounded-t-lg h-[35%]" />
            <div className="bg-yellow-400/60 w-full rounded-t-lg h-[85%]" />
            <div className="bg-yellow-400 w-full rounded-t-lg h-[100%]" />
          </div>

          <div className="mt-6 flex justify-between text-xs text-gray-400">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-3xl p-8">
          <h6 className="font-bold text-white mb-6">
            Inventory Usage
          </h6>

          <div className="space-y-6">

            {/* Item 1 */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-gray-300">
                <span>Wagyu Beef</span>
                <span className="text-red-400">18% left</span>
              </div>
              <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div className="h-full bg-red-400 w-[18%]" />
              </div>
            </div>

            {/* Item 2 */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-gray-300">
                <span>Vintage Rose</span>
                <span className="text-yellow-400">45% left</span>
              </div>
              <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-[45%]" />
              </div>
            </div>

            {/* Item 3 */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-gray-300">
                <span>Organic Produce</span>
                <span className="text-green-400">92% left</span>
              </div>
              <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div className="h-full bg-green-400 w-[92%]" />
              </div>
            </div>

          </div>
        </div>

        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-3xl p-8">
          <h6 className="font-bold text-white mb-6">
            Best Selling Items
          </h6>

          <div className="space-y-5">

            {/* Rank 1 */}
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded bg-yellow-400/20 flex items-center justify-center font-bold text-yellow-400">
                01
              </span>
              <div>
                <p className="text-sm font-bold text-white">
                  Black Truffle Risotto
                </p>
                <p className="text-xs text-gray-400">
                  248 sold this week
                </p>
              </div>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded bg-[#2a2a2a] flex items-center justify-center font-bold text-gray-300">
                02
              </span>
              <div>
                <p className="text-sm font-bold text-white">
                  A5 Wagyu Strip
                </p>
                <p className="text-xs text-gray-400">
                  192 sold this week
                </p>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded bg-[#2a2a2a] flex items-center justify-center font-bold text-gray-300">
                03
              </span>
              <div>
                <p className="text-sm font-bold text-white">
                  Osetra Caviar Service
                </p>
                <p className="text-xs text-gray-400">
                  84 sold this week
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}