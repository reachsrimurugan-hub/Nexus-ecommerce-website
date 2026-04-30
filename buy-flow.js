document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML
    const modalHTML = `
        <div class="auth-overlay" id="authOverlay"></div>
        <div class="auth-modal" id="authModal">
            <button class="close-auth" id="closeAuthBtn"><i data-lucide="x" style="width:20px; height:20px;"></i></button>
            
            <div id="authStep1">
                <h2 class="auth-title">Sign in or create account</h2>
                <div class="auth-form-group">
                    <label for="authInput">Enter mobile number or email</label>
                    <input type="text" id="authInput" placeholder="Mobile number or email">
                    <span class="auth-error" id="authError">Please enter a valid email or 10-digit mobile number.</span>
                </div>
                
                <button class="btn-continue" id="authContinueBtn">
                    <span class="btn-text" id="authBtnText">Continue</span>
                    <div class="spinner" id="authSpinner" style="display:none;"></div>
                </button>
                
                <p class="auth-terms">
                    By continuing, you agree to <a href="#">Terms of Use</a> and <a href="#">Privacy Notice</a>.
                </p>

                <div class="auth-divider"><span>or</span></div>
                
                <div class="social-login">
                    <button class="btn-social">
                        Continue with Google
                    </button>
                    <button class="btn-social">
                       Continue with Apple
                    </button>
                </div>
            </div>

            <div id="authStep2" style="display:none;">
                <h2 class="auth-title">Verify your identity</h2>
                <p style="margin-bottom: 20px; font-size: 0.95rem; color: #666;">We've sent an OTP to your email/mobile.</p>
                <div class="auth-form-group">
                    <label for="otpInput">Enter OTP</label>
                    <input type="text" id="otpInput" placeholder="Enter 6-digit OTP" maxlength="6">
                    <span class="auth-error" id="otpError">Invalid OTP. Enter any 6 digits to proceed.</span>
                </div>
                <button class="btn-continue" id="verifyBtn">
                    <span class="btn-text" id="verifyBtnText">Verify & Continue</span>
                    <div class="spinner" id="verifySpinner" style="display:none;"></div>
                </button>
            </div>
            
            <div id="authStep3" style="display:none; text-align:center; padding: 30px 0;">
                <div style="color: #10b981; margin-bottom: 20px; display: flex; justify-content: center;">
                    <i data-lucide="check-circle" style="width: 60px; height: 60px;"></i>
                </div>
                <h2 class="auth-title" style="margin-bottom: 10px;">Login Successful!</h2>
                <p style="color: #666;">Redirecting to checkout...</p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    if (window.lucide) {
        lucide.createIcons();
    }

    const modal = document.getElementById('authModal');
    const overlay = document.getElementById('authOverlay');
    const closeBtn = document.getElementById('closeAuthBtn');

    const step1 = document.getElementById('authStep1');
    const step2 = document.getElementById('authStep2');
    const step3 = document.getElementById('authStep3');

    const input = document.getElementById('authInput');
    const errorMsg = document.getElementById('authError');
    const continueBtn = document.getElementById('authContinueBtn');
    const authBtnText = document.getElementById('authBtnText');
    const authSpinner = document.getElementById('authSpinner');

    const otpInput = document.getElementById('otpInput');
    const otpError = document.getElementById('otpError');
    const verifyBtn = document.getElementById('verifyBtn');
    const verifyBtnText = document.getElementById('verifyBtnText');
    const verifySpinner = document.getElementById('verifySpinner');

    // Restore input
    if (localStorage.getItem('savedAuthInput')) {
        input.value = localStorage.getItem('savedAuthInput');
    }

    function openModal(e) {
        if (e) e.preventDefault();

        // Reset states
        step1.style.display = 'block';
        step2.style.display = 'none';
        step3.style.display = 'none';
        input.value = localStorage.getItem('savedAuthInput') || '';
        errorMsg.style.display = 'none';
        otpInput.value = '';
        otpError.style.display = 'none';

        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Since elements can be added dynamically, attach to body and delegate
    document.body.addEventListener('click', (e) => {
        // If clicking on element with class buy-now or id buyBtn
        const target = e.target.closest('.buy-now') || e.target.closest('#buyBtn');
        if (target) {
            e.preventDefault();
            e.stopPropagation(); // prevent other click handlers if any
            openModal(e);
        }
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Validation
    function validateInput(val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;
        return emailRegex.test(val) || mobileRegex.test(val);
    }

    // Continue Step 1
    continueBtn.addEventListener('click', () => {
        const val = input.value.trim();

        if (!validateInput(val)) {
            errorMsg.style.display = 'block';
            input.style.borderColor = '#e63946';
            return;
        }

        errorMsg.style.display = 'none';
        input.style.borderColor = '#ccc';
        localStorage.setItem('savedAuthInput', val);

        // Loading state
        authBtnText.style.display = 'none';
        authSpinner.style.display = 'block';
        continueBtn.disabled = true;

        setTimeout(() => {
            authBtnText.style.display = 'block';
            authSpinner.style.display = 'none';
            continueBtn.disabled = false;

            step1.style.display = 'none';
            step2.style.display = 'block';
        }, 1000);
    });

    // Verify Step 2
    verifyBtn.addEventListener('click', () => {
        const otp = otpInput.value.trim();

        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            otpError.style.display = 'block';
            otpInput.style.borderColor = '#e63946';
            return;
        }

        otpError.style.display = 'none';
        otpInput.style.borderColor = '#ccc';

        // Loading state
        verifyBtnText.style.display = 'none';
        verifySpinner.style.display = 'block';
        verifyBtn.disabled = true;

        setTimeout(() => {
            verifyBtnText.style.display = 'block';
            verifySpinner.style.display = 'none';
            verifyBtn.disabled = false;

            step2.style.display = 'none';
            step3.style.display = 'block';

            if (window.lucide) {
                lucide.createIcons();
            }

            setTimeout(() => {
                closeModal();
                // Optionally redirect to checkout
                alert("Redirecting to Checkout...");
            }, 2000);
        }, 1500);
    });
});
