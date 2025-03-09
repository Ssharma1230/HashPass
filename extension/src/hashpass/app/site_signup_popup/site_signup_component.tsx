import PasswordGenerator from "../security_components/components/password_generator"
export default function Site_SignUp() {
    return (
        <div className="w-64 p-4 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2">Sign Up</h2>
          <p className="text-sm text-gray-600 mb-4">Click the button to generate a secure password</p>
          <PasswordGenerator/>
        </div>
      );
}