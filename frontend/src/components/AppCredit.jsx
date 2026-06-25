import PropTypes from "prop-types";

function AppCredit({ className = "" }) {
  return (
    <div className={className}>
      <p className="text-sm text-gray-400">
        Designed &amp; developed by{" "}
        <span className="font-semibold text-gray-200">Nishan Giri</span>
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Web Security (ST6005CEM) — College Project
      </p>
    </div>
  );
}

AppCredit.propTypes = {
  className: PropTypes.string,
};

export default AppCredit;
