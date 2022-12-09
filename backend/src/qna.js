import {findBestMatch} from 'string-similarity'
const QNA = [
    [
        "What are the opening hours of the fairprice at Our Tampines Hub?",
        "24 hours a day"
    ], [
        "What payment methods does Fairprice accept?",
        "Visa, NETs, Fairprice App"
    ], [
        "Do I need to pay for plastic bags?",
        "Yes there is a charge of $0.20 per plastic bag. We recommend bringing your own reusable bag to help save the environment!"
    ], [
        "How do I register for a Fairprice membership account?",
        "You can create an account online at https://www.fairprice.com.sg/membership/registration"
    ]
]
const QNS = QNA.map(ls => ls[0])
const ANS = QNA.map(ls => ls[1])

const searchHelp = (query) => {
    const {bestMatch, bestMatchIndex} = findBestMatch(query, QNS)
    if (bestMatch.rating < 0.1) return undefined
    else return {
        question: bestMatch.target,
        answer: ANS[bestMatchIndex]
    }
}

export default searchHelp
