import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
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
  SocialButton,
  ErrorMessage,
  Divider,
  StyledLink,
  RememberMeWrapper,
  Checkbox,
  ForgotPassword
} from "../styles/authStyles";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.code === "auth/wrong-password" ? "Invalid password" :
              err.code === "auth/user-not-found" ? "User not found" :
              "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, githubProvider);
      navigate("/dashboard");
    } catch (err) {
      setError("GitHub login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    // Add password reset logic here
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <VideoBackground autoPlay loop muted playsInline>
          <source src={loginBackground} type="video/mp4" />
        </VideoBackground>

        <Box>
          <h2>Welcome Back</h2>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
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

          <RememberMeWrapper>
            <label>
              <Checkbox
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <ForgotPassword onClick={handleForgotPassword}>
              Forgot Password?
            </ForgotPassword>
          </RememberMeWrapper>

          <Button onClick={handleLogin} disabled={loading} delay="0.3s">
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <Divider>
            <span>or continue with</span>
          </Divider>

          <SocialButton
            onClick={handleGoogleLogin}
            disabled={loading}
            google
            delay="0.4s"
          >
            <FaGoogle /> Login with Google
          </SocialButton>

          <SocialButton
            onClick={handleGithubLogin}
            disabled={loading}
            github
            delay="0.5s"
          >
            <FaGithub /> Login with GitHub
          </SocialButton>

          <StyledLink as={Link} to="/signup">
            Don't have an account? Sign up
          </StyledLink>
        </Box>
      </Container>
    </>
  );
}

export default Login;
