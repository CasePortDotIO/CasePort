    }
    return 'Act now to preserve evidence and maximize your settlement';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">What's Your Case Worth?</h3>
        <p className="text-gray-600 text-lg">
          Get a personalized estimate based on real settlement data from {data.casesInMarket}+ cases in your market.
        </p>
      </div>

      {/* Main Estimator Container */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left: Interactive Controls */}
        <div className="space-y-8">
          {/* Injury Type Selector */}
          <div>