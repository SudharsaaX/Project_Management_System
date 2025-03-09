import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaSpinner, FaExclamationCircle, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import loginBackground from "../assets/login_background.mp4";
import {
  GlobalStyle,
  Container,
  VideoBackground,
  Box,
  InputWrapper,
  Input,
  ShowPasswordButton,
  Button,
  ErrorMessage,
  StyledLink,
  PasswordRequirements,
  ProgressBar,
  StrengthIndicator
} from "../styles/authStyles";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const validatePassword = () => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
      match: password === confirmPassword
    };
    return requirements;
  };

  const calculatePasswordStrength = () => {
    const requirements = validatePassword();
    const validCount = Object.values(requirements).filter(Boolean).length;
    return (validCount / 6) * 100;
  };

  const getStrengthText = (strength) => {
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Medium';
    if (strength >= 20) return 'Weak';
    return 'Very Weak';
  };

  const handleSignup = async () => {
    const requirements = validatePassword();
    
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!Object.values(requirements).every(Boolean)) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.code === "auth/email-already-in-use" 
        ? "Email already exists" 
        : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  const requirements = validatePassword();
  const strength = calculatePasswordStrength();

  return (
    <>
      <GlobalStyle />
      <Container>
        <VideoBackground autoPlay loop muted playsInline>
          <source src={loginBackground} type="video/mp4" />
        </VideoBackground>

        <Box>
          <h2>Create Account</h2>
          {error && (
            <ErrorMessage>
              <FaExclamationCircle />
              {error}
            </ErrorMessage>
          )}
          
          <InputWrapper delay="0.1s">
            <FaEnvelope />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              error={error && error.includes("email")}
            />
          </InputWrapper>

          <InputWrapper delay="0.2s">
            <FaLock />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              error={error && error.includes("password")}
            />
            <ShowPasswordButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </ShowPasswordButton>
          </InputWrapper>

          <InputWrapper delay="0.3s">
            <FaLock />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              error={error && error.includes("password")}
            />
            <ShowPasswordButton
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </ShowPasswordButton>
          </InputWrapper>

          <ProgressBar progress={strength} />
          <StrengthIndicator strength={strength}>
            Password Strength: {getStrengthText(strength)}
          </StrengthIndicator>

          <PasswordRequirements>
            <p className={requirements.length ? 'valid' : 'invalid'}>
              {requirements.length ? <FaCheck /> : <FaTimes />}
              At least 8 characters
            </p>
            <p className={requirements.uppercase ? 'valid' : 'invalid'}>
              {requirements.uppercase ? <FaCheck /> : <FaTimes />}
              One uppercase letter
            </p>
            <p className={requirements.lowercase ? 'valid' : 'invalid'}>
              {requirements.lowercase ? <FaCheck /> : <FaTimes />}
              One lowercase letter
            </p>
            <p className={requirements.number ? 'valid' : 'invalid'}>
              {requirements.number ? <FaCheck /> : <FaTimes />}
              One number
            </p>
            <p className={requirements.special ? 'valid' : 'invalid'}>
              {requirements.special ? <FaCheck /> : <FaTimes />}
              One special character (!@#$%^&*)
            </p>
            <p className={requirements.match ? 'valid' : 'invalid'}>
              {requirements.match ? <FaCheck /> : <FaTimes />}
              Passwords match
            </p>
          </PasswordRequirements>

          <Button onClick={handleSignup} disabled={loading} delay="0.4s">
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <StyledLink as={Link} to="/login">
            Already have an account? Login
          </StyledLink>
        </Box>
      </Container>
    </>
  );
}

export default Signup;
