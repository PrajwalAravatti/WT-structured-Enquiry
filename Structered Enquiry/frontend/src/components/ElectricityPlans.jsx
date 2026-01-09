import PropTypes from 'prop-types';

/**
 * Predefined Electricity Plans
 */
const ELECTRICITY_PLANS = [
    {
        planName: 'Basic Plan',
        pricePerUnit: 5,
        unitsIncluded: 100,
        validity: 30,
        status: 'Active'
    },
    {
        planName: 'Standard Plan',
        pricePerUnit: 4.5,
        unitsIncluded: 250,
        validity: 30,
        status: 'Active'
    },
    {
        planName: 'Premium Plan',
        pricePerUnit: 4,
        unitsIncluded: 500,
        validity: 30,
        status: 'Active'
    },
    {
        planName: 'Ultra Plan',
        pricePerUnit: 3.5,
        unitsIncluded: 1000,
        validity: 60,
        status: 'Active'
    }
];

/**
 * ElectricityPlans Component
 * Displays all available electricity plans in a grid
 */
function ElectricityPlans({ selectedPlan, onSelectPlan }) {
    return (
        <section className="plans-section">
            <h2 className="section-title">Select Your Electricity Plan</h2>
            <div className="plans-grid">
                {ELECTRICITY_PLANS.map((plan) => (
                    <div
                        key={plan.planName}
                        className={`plan-card ${selectedPlan?.planName === plan.planName ? 'selected' : ''}`}
                        onClick={() => onSelectPlan(plan)}
                    >
                        {/* Selection indicator */}
                        {selectedPlan?.planName === plan.planName && (
                            <div className="selected-badge">Selected</div>
                        )}

                        {/* Plan name */}
                        <h3 className="plan-name">{plan.planName}</h3>

                        {/* Plan details */}
                        <div className="plan-details">
                            <div className="plan-detail-item">
                                <span className="detail-label">Price per Unit</span>
                                <span className="detail-value">₹{plan.pricePerUnit}</span>
                            </div>

                            <div className="plan-detail-item">
                                <span className="detail-label">Units Included</span>
                                <span className="detail-value electric-highlight">{plan.unitsIncluded} kWh</span>
                            </div>

                            <div className="plan-detail-item">
                                <span className="detail-label">Validity</span>
                                <span className="detail-value">{plan.validity} days</span>
                            </div>

                            <div className="plan-detail-item">
                                <span className="detail-label">Status</span>
                                <span className={`status-badge ${plan.status === 'Active' ? 'active' : 'expired'}`}>
                                    {plan.status}
                                </span>
                            </div>
                        </div>

                        {/* Electric border animation element */}
                        <div className="plan-border-glow"></div>
                    </div>
                ))}
            </div>
        </section>
    );
}

ElectricityPlans.propTypes = {
    selectedPlan: PropTypes.object,
    onSelectPlan: PropTypes.func.isRequired
};

export default ElectricityPlans;
