"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiFileText, FiBook, FiShield, FiMail, FiLink } from 'react-icons/fi';
import { MdOutlinePolicy, MdOutlineSecurity } from "react-icons/md";

const TermsAndConditions = () => {
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  return (
    <div>
      {/* Header Bar */}
      <div className="bg-blue-50 py-6 px-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Terms & Conditions</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-blue-600 font-semibold">Terms & Conditions</span>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-9xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFileText className="text-blue-600 text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-customBlue mb-4">TERMS & CONDITIONS</h1>
            {currentDate && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Last updated: {currentDate}
              </p>
            )}
          </div>

          {/* Terms Content */}
          <div className="rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Introduction */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-customBlue mb-4 flex items-center gap-2">
                <FiBook className="text-customBlue" /> Website Terms
              </h2>
              <p className="text-gray-600 mb-4">
                Welcome to uniletstores.com. By continuing to browse and use this website, you agree to comply with and be bound by the following terms and conditions of use, which, along with our Privacy Policy, govern Unilet Appliances Private Limited’s relationship with you regarding this website.
              </p>
              <p className="text-gray-600 mb-4">
                The term ‘Unilet Appliances Private Limited’ or ‘us’ or ‘we’ refers to the owner of the website, whose registered office is “Manika,” No. 60, 1st Floor, 60 Feet Main Road, Opp. ICICI Bank, G Block Sahakarnagar, Bengaluru – 560092. The term ‘you’ refers to the user or viewer of our website.
              </p>
            </div>

            {/* Terms of Use */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                Use of this website is subject to the following Terms and Conditions:
              </h3>
              <p className="text-gray-600 mb-4">
              The content on this website is provided for your general information and use only. It is subject to change without notice.</p>
              <p className="text-gray-600 mb-4">Neither we nor any third parties offer any warranty or guarantee regarding the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose.</p>
              <p className="text-gray-600 mb-4">You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</p>
              <p className="text-gray-600 mb-4">Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It is your responsibility to ensure that any products or information available through this website meet your specific requirements.</p>
              <p className="text-gray-600 mb-4">This website contains material that is owned by or licensed to us, including but not limited to the design, layout, look, appearance, and graphics.</p>
              <p className="text-gray-600 mb-4">Reproduction is prohibited except in accordance with the copyright notice, which forms part of these terms and conditions.</p>
              <p className="text-gray-600 mb-4">All trademarks reproduced on this website that are not the property of, or licensed to, the operator are acknowledged on the website. Unauthorized use of this website may give rise to a claim for damages and/or constitute a criminal offense.</p>
              <p className="text-gray-600 mb-4">From time to time, this website may include links to other websites. These links are provided for your convenience to offer further information. They do not signify that we endorse the linked website(s), and we have no responsibility for the content of the linked website(s).</p>
              <p className="text-gray-600 mb-4">You may not create a link to this website from another website or document without prior written consent from Unilet Appliance Private Limited. Your use of this website and any dispute arising out of such use is subject to the laws of India or other relevant regulatory authority.</p>
              <p className="text-gray-600 mb-4">I authorize Unilet Appliances Pvt. Ltd to call, SMS, or communicate via WhatsApp regarding my order details and promotional activities.</p>
              <p className="text-gray-600 mb-4">Unless otherwise agreed in writing with Unilet Appliance Private Limited, your agreement with Unilet Appliance Private Limited will always include, at a minimum, the terms and conditions set out in this document. These are referred to as the General Terms.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                1. Accepting the Terms:
              </h3>
              <p className="text-gray-600 mb-4">
              To use the services, you must first agree to the terms. You may not use the services if you do not accept the terms.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                2. Clicking to accept or agree to the terms:
              </h3>
              <p className="text-gray-600 mb-4">
              Where this option is made available to you by Unilet Appliance Private Limited in the user interface for any service, or by actually using the services, you understand and agree that Unilet Appliance Private Limited will consider your use of the services as acceptance of the terms from that point onwards.</p>
              <p>You may not use the services and may not accept the terms if:</p>
              <ul className="list-disc pl-5 space-y-3 text-gray-600">
                <li>A. You are not of legal age to form a binding contract with Unilet Appliance Private Limited, or</li>
                <li>B. You are prohibited from receiving the services under the laws of India.</li>
              </ul>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                3. Site Content:
              </h3>
              <p className="text-gray-600 mb-4">
              You acknowledge that the site contains information, data, software, photographs, graphics, videos, text, images, typefaces, sounds, and other materials (collectively “Content”) that are protected by copyrights, trademarks, or other proprietary rights, and that these rights are valid and protected in all forms, media, and technologies existing now or developed in the future.</p>
              <p className="text-gray-600 mb-4">All Content is copyrighted as a collective work under Indian copyright laws, and we hold a copyright in the selection, coordination, arrangement, and enhancement of such Content.</p>
              <p className="text-gray-600 mb-4">You may not modify, remove, delete, augment, add to, publish, transmit, participate in the transfer or sale of, create derivative works from, or in any way exploit any of the Content, in whole or in part. If no specific restrictions are displayed, you may make copies of selected portions of the Content solely for your personal, informational, and non-commercial use, provided that you do not alter or modify the Content and maintain any notices contained in the Content, such as copyright notices, trademark legends, or other proprietary rights notices.</p>
              <p className="text-gray-600 mb-4">Additionally, use of any software Content shall be governed by the software license agreement accompanying such software, if any.</p>
              <p className="text-gray-600 mb-4">Online pricing and offers are valid for online customers only.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                4. Advertisements:
              </h3>
              <p className="text-gray-600 mb-4">
              Some of the services are supported by advertisements and sales promotions. These advertisements may be targeted based on the content of information stored on the services, new launches, queries made through the services, or other information.</p>
              <p className="text-gray-600 mb-4">The manner, mode, and extent of advertising by Unilet Appliance Private Limited on the services may change without specific notice to you.</p>
              <p className="text-gray-600 mb-4">In consideration of Unilet Appliance Private Limited granting you access to and use of the services, you agree that Unilet Appliance Private Limited may place such advertising on the services.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                5. Submissions:
              </h3>
              <p className="text-gray-600 mb-4">
              If you submit, post, or otherwise send us any information, content, or materials—including but not limited to comments, reviews, data, text, messages, files, images, photographs, videos, audio-visual works, names, likenesses, voices, usernames, profiles, actions, appearances, performances, or other biographical information or material—along with any links to data, text, files, images, photographs, videos, or audio-visual works, you agree that we are entitled to unrestricted use of such submissions for any purpose, whether commercial or otherwise, without requiring further permission from or payment to you or any other person or entity. This includes, but is not limited to, inclusion in any future Gale publication or Gale product, with no compensation to you.</p>
              <p className="text-gray-600 mb-4">No submission shall be subject to any confidentiality obligation on our part, and we shall not be liable for any use or disclosure of any submission. By submitting, you hereby grant us the rights described above.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                6. Payment & Billing:
              </h3>
              <p className="text-gray-600 mb-4">
              You must select a payment method to pay for any purchases you make from us. Each time you use the service, you reaffirm that we or our authorized billing agents are authorized to charge your designated payment method.</p>
              <p className="text-gray-600 mb-4">We may submit charges incurred under your account for payment, and you will be responsible for these charges, even if your membership is cancelled or terminated. You agree that we may charge your payment method for all amounts due to us without additional notice or consent, unless otherwise required by law.</p>
              <p className="text-gray-600 mb-4">You are responsible for all charges incurred under your account, whether made by you or anyone who uses your account (including your children, family, or friends).</p>
              <p className="text-gray-600 mb-4">We may, at our discretion, post charges to your payment method individually or aggregate them with other purchases you make on the site and apply those charges to your next billing cycle. All purchases for mobile services, accessories, and subscriptions are final and non-refundable.</p>
              <p className="text-gray-600 mb-4">You must notify us of any billing problems or discrepancies within 3 days after they first appear on the statement you receive from your bank or credit card company.</p>
              <p className="text-gray-600 mb-4">If you do not report such problems or discrepancies within 3 days, you agree to waive the right to dispute them.</p>
              <p className="text-gray-600 mb-4">In the case of order cancellation, payment will be refunded via NEFT or a cheque within 14 working days. (We cannot offer refunds in cash.)</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                7. Proof of Identification:
              </h3>
              <p className="text-gray-600 mb-4">
              Unilet Appliance Private Limited reserves the right to request proof of identification at the time of delivery. Failure to provide the required identification to Unilet Appliance Private Limited or its associates may result in the cancellation of the order. For gift items, the customer who made the online transaction must also provide proof of identification.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                8. Limitation of Liability:
              </h3>
              <p className="text-gray-600 mb-4">
             You agree to fully indemnify, defend, and hold harmless our company, its parent and affiliates, and their respective officers, directors, employees, and licensors from any and all claims, liabilities, losses, costs, and expenses (including attorneys’ fees) incurred by you in connection with:</p>
              <p className="text-gray-600 mb-4">Any use or alleged use of Unilet Appliance Private Limited’s services through your account by any person, whether authorized by you or not;
              The operation and content on your site;
              Any breach of your representations, warranties, and other covenants under this agreement.
              Unilet Appliance Private Limited reserves the right, at its own expense, to assume exclusive defense and control of any matter otherwise subject to indemnification by you. In such cases, you agree to cooperate with Unilet Appliance Private Limited in the defense of such claims.</p>
              <p className="text-gray-600 mb-4">Under no circumstances and under no legal theory, whether in tort, contract, strict liability, or otherwise, shall Unilet Appliance Private Limited be liable to you or any other person for any indirect, special, incidental, or consequential damages of any kind, including, without limitation, damages for lost profits, loss of goodwill, work stoppage, accuracy of services, content or results, computer failure or malfunction, or damages resulting from disabling the services provided as part of the mobile store(s).</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                9. Applicable Taxes:
              </h3>
              <p className="text-gray-600 mb-4">
              Unless otherwise stated, all prices exclude Value Added Tax (VAT), Central Sales Tax, and Service Tax, as applicable in India.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                10. Warranty:
              </h3>
              <p className="text-gray-600 mb-4">
              Products sold are warranted for a period defined by the respective manufacturers or agents against defects in material and workmanship. Unilet Appliance Private Limited does not provide any warranty and makes no representations regarding the products sold.</p>
               <p className="text-gray-600 mb-4">
              Unilet Appliance Private Limited will not be responsible for any defective, deficient, or otherwise unsatisfactory products. Any such defective or deficient goods must be repaired only by an authorized service center of the equipment manufacturer.</p>
              <p className="text-gray-600 mb-4">
              All terms and conditions of Unilet Appliance Private Limited apply, subject to the jurisdiction of Bangalore. Goods once sold cannot be returned or exchanged.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                11. No Cost EMI:
              </h3>
              <p className="text-gray-600 mb-4">
              These terms and conditions shall be governed by and construed in accordance with the laws of India. Any legal discrepancies or disputes will be resolved exclusively in the Indian courts at Bangalore, Karnataka.</p>
              <p className="text-gray-600 mb-4">
              Unilet Appliance Private Limited will not be responsible for any defective, deficient, or otherwise unsatisfactory products. Any such defective or deficient goods must be repaired solely by an authorized service center of the equipment manufacturer.</p>
              <p className="text-gray-600 mb-4">
              All terms and conditions of Unilet Appliance Private Limited apply, subject to the jurisdiction of Bangalore. Goods once sold cannot be returned or exchanged.</p>
            </div>

            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                Eligibility
              </h3>
              <p className="text-gray-600 mb-4">
              Only individuals who can enter into legally binding contracts under the Indian Contract Act, 1872—i.e., those who are 18 years of age or older, of sound mind, and not disqualified by law—may use the Unilet Appliances Platform and place an order. If you are a minor (under 18 years of age), you may purchase products on the Reliance Digital Platform only with the involvement of a parent or guardian.</p>
            </div>

           

            {/* Contact Info */}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-customBlue mb-3 flex items-center gap-2">
                <FiMail className="text-customBlue" />
               Contact us at
              </h3>
              <p className="text-gray-600 mb-6">
                Registered Office:#60, 1st Floor, Near ICICI Bank, Sahakar Nagar, Bengaluru, Karnataka 560092
              </p>
              <p className="text-gray-600 mb-6">
                Contact Numer: +91 9243585858
              </p>
              <a 
                href="mailto:info@uniletstores.com" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
              >
              info@uniletstores.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;