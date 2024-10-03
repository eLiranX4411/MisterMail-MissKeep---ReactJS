
const { useState } = React

export function LongTxt({ txt, length = 100 }) {
    
    const [isExpanded, setIsExpanded] = useState(false)

    function getDisplayText() {
        if (!txt) return ''

        if (isExpanded || txt.length <= length) {
            return txt
        } else {
            return txt.substring(0, 100) + '...'
        }
    }

    function onToggleExpansion() {
        setIsExpanded(prevIsExpanded => !prevIsExpanded)
    }

    return (
        <section className="long-text">
            <p>
                {getDisplayText()}
                {txt && txt.length > length && (
                    <button onClick={onToggleExpansion}>
                        {isExpanded ? 'Less...' : 'More...'}
                    </button>
                )}
            </p>

        </section>
    )

   
}