import { FiSearch, FiCreditCard, FiTrendingUp } from "react-icons/fi";

const steps = [
  {
    icon: FiSearch,
    title: "Discover Projects",
    description:
      "Browse through hundreds of innovative campaigns across various categories and find projects that inspire you.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FiCreditCard,
    title: "Purchase Credits",
    description:
      "Buy platform credits securely using our payment system. Credits are your gateway to supporting amazing projects.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FiTrendingUp,
    title: "Support & Track",
    description:
      "Contribute credits to campaigns you believe in and track their progress as they move closer to their goals.",
    color: "from-green-500 to-emerald-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How FundSpark Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Getting started is easy. Follow these simple steps to begin your
            crowdfunding journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
