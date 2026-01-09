function SuccessPage({ onReset }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your feedback has been successfully submitted.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">
              We truly appreciate you taking the time to share your thoughts with us. 
              Your input is invaluable in helping us create a better workplace for everyone. 
              Management will review your submission and take appropriate action.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={onReset}
              className="w-full bg-gradient-to-r from-deroyal-blue to-deroyal-light text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
            >
              Submit Another Feedback
            </button>
            
            <button
              onClick={() => window.close()}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-50 transition duration-200"
            >
              Close Window
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-sm text-gray-500">
            <p>If you have any questions, please contact Human Resources.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
