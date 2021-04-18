using System;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using HotChocolate.Language;
using HotChocolate.Properties;

#nullable enable

namespace HotChocolate.Types
{
    /// <summary>
    /// This GraphQL Scalar represents an exact point in time.
    /// This point in time is specified by being UTC. This builds off of DateTimeType from HotChocolate
    ///
    /// https://www.graphql-scalars.com/date-time/
    /// </summary>
    public class UtcDateTimeType : ScalarType<DateTimeOffset, StringValueNode>
    {
        private const string _utcFormat = "yyyy-MM-ddTHH\\:mm\\:ss.fffZ";
        private const string _localFormat = "yyyy-MM-ddTHH\\:mm\\:ss.fffzzz";
        private const string _specifiedBy = "https://www.graphql-scalars.com/date-time";

        /// <summary>
        /// Initializes a new instance of the <see cref="DateTimeType"/> class.
        /// </summary>
        public UtcDateTimeType()
            : this(
                ScalarNames.DateTime,
                "The `UTCDateTime` scalar represents an ISO-8601 compliant date time type, forced into UTC.",
                BindingBehavior.Implicit)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DateTimeType"/> class.
        /// </summary>
        public UtcDateTimeType(
            NameString name,
            string? description = null,
            BindingBehavior bind = BindingBehavior.Explicit)
            : base(name, bind)
        {
            Description = description;
            SpecifiedBy = new Uri(_specifiedBy);
        }

        protected override DateTimeOffset ParseLiteral(StringValueNode valueSyntax)
        {
            if (TryDeserializeFromString(valueSyntax.Value, out DateTimeOffset? value))
            {
                return value.Value;
            }

            throw new SerializationException("UTCDateTime failed to parse.", this);

        }

        protected override StringValueNode ParseValue(DateTimeOffset runtimeValue)
        {
            return new(Serialize(runtimeValue));
        }

        public override IValueNode ParseResult(object? resultValue)
        {
            if (resultValue is null)
            {
                return NullValueNode.Default;
            }

            if (resultValue is string s)
            {
                return new StringValueNode(s);
            }

            if (resultValue is DateTimeOffset d)
            {
                return ParseValue(d);
            }

            if (resultValue is DateTime dt)
            {
                return ParseValue(new DateTimeOffset(dt, TimeSpan.Zero));
            }

            throw new SerializationException("UTCDateTime failed to serialize.", this);
        }

        public override bool TrySerialize(object? runtimeValue, out object? resultValue)
        {
            if (runtimeValue is null)
            {
                resultValue = null;
                return true;
            }

            if (runtimeValue is DateTimeOffset dt)
            {
                resultValue = Serialize(dt);
                return true;
            }

            if (runtimeValue is DateTime d)
            {
                resultValue = Serialize(new DateTimeOffset(d, TimeSpan.Zero));
                return true;
            }

            resultValue = null;
            return false;
        }

        public override bool TryDeserialize(object? resultValue, out object? runtimeValue)
        {
            if (resultValue is null)
            {
                runtimeValue = null;
                return true;
            }

            if (resultValue is string s && TryDeserializeFromString(s, out DateTimeOffset? d))
            {
                runtimeValue = d;
                return true;
            }

            if (resultValue is DateTimeOffset)
            {
                runtimeValue = resultValue;
                return true;
            }

            if (resultValue is DateTime dt)
            {
                runtimeValue = new DateTimeOffset(
                    dt,
                    TimeSpan.Zero);
                return true;
            }

            runtimeValue = null;
            return false;
        }

        private static string Serialize(DateTimeOffset value)
        {
            if (value.Offset == TimeSpan.Zero)
            {
                return value.ToString(
                    _utcFormat,
                    CultureInfo.InvariantCulture);
            }

            return value.ToString(
                _utcFormat,
                CultureInfo.InvariantCulture);
        }

        private static bool TryDeserializeFromString(
            string? serialized,
            [NotNullWhen(true)] out DateTimeOffset? value)
        {
            if (serialized is not null
                && serialized.EndsWith("Z")
                && DateTime.TryParse(
                    serialized,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal,
                    out DateTime zuluTime))
            {
                value = new DateTimeOffset(
                    zuluTime,
                    TimeSpan.Zero);
                return true;
            }

            if (serialized is not null
                && DateTimeOffset.TryParse(
                    serialized,
                    out DateTimeOffset dt))
            {
                value = dt;
                return true;
            }

            value = null;
            return false;
        }
    }
}
