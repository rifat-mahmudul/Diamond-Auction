import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


const faqs = [
    {
        question: "How do I register for an auction?",
        answer:
            "Click the Register button at the top of the page. Fill out your information and verify your email to get started.",
    },
    {
        question: "Is there a fee to join or bid?",
        answer:
            "No, registration is completely free! You only pay if you win an auction.",
    },
    {
        question: "How do I place a bid?",
        answer:
            "Once registered, browse items and click Place Bid on any product page. Enter your bid amount and confirm.",
    },
    {
        question: "What payment methods are accepted?",
        answer:
            "We accept major credit cards, PayPal, and secure bank transfers.",
    },
    {
        question: "How do I receive my item after winning?",
        answer:
            "After payment is complete, your item will be shipped directly to your address. Tracking details will be provided.",
    },
    {
        question: "Who can I contact for help?",
        answer:
            "Our support team is available 24/7. Visit our Contact Us page or email info@diamondauctionsllc.com"
    }
]

function Faq() {
    return (
        <div>
            <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="rounded-lg">
                        <AccordionTrigger className="text-left text-base md:text-xl lg:text-2xl font-semibold">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-[#595959] text-sm lg:text-xl">{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default Faq